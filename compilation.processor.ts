import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAI } from 'openai';
import { EseService } from '../ese/ese.service';

interface CompilationJobData {
  compilationId: string;
  projectId: string;
  userId: string;
  pageRange: string;
  inspiration: string;
}

@Processor('compilation-queue')
export class CompilationProcessor {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(private prisma: PrismaService, private eseService: EseService) {}

  @Process('compile-story')
  async handleCompilation(job: Job<CompilationJobData>) {
    const { compilationId, projectId, pageRange, inspiration } = job.data;
    await job.updateProgress(5, 'Starting compilation...');

    // 1. Update status to 'processing'
    await this.prisma.storyCompilation.update({
      where: { id: compilationId },
      data: { status: 'processing' },
    });

    try {
      // 2. Fetch project and entries
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });
      const entries = await this.prisma.journalEntry.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' },
      });
      await job.updateProgress(10, 'Analyzing journal entries...');

      // 3. Analyze emotional context
      const emotionalAnalysis = await this.eseService.analyze(
        entries.map(e => e.body).join(' '),
      );
      await job.updateProgress(15, 'Generating story outline...');

      // 4. Generate Outline
      const outlinePrompt = this.buildOutlinePrompt(project, entries, emotionalAnalysis, pageRange, inspiration);
      const outlineCompletion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: outlinePrompt }],
      });
      const outline = JSON.parse(
        outlineCompletion.choices[0].message.content || '[]',
      );
      await this.prisma.storyCompilation.update({
        where: { id: compilationId },
        data: { outline },
      });
      await job.updateProgress(30, 'Outline generated. Writing chapters...');

      // 5. Generate Chapters
      const chapters = [];
      for (let i = 0; i < outline.length; i++) {
        const chapter = outline[i];
        await job.updateProgress(30 + (60 / outline.length) * i, `Writing Chapter ${i + 1}...`);
        const chapterPrompt = this.buildChapterPrompt(
          project,
          entries,
          chapter,
          i + 1,
          emotionalAnalysis,
          pageRange,
          inspiration
        );
        const chapterCompletion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: chapterPrompt }],
        });
        chapters.push(chapterCompletion.choices[0].message.content || '');
      }

      // 6. Assemble and Post-process
      const fullStory = chapters.join('\n\n---\n\n');
      const toc = outline
        .map((o: any, i: number) => `Chapter ${i + 1}: ${o.title}`)
        .join('\n');
      const finalStory = `Table of Contents:\n${toc}\n\n${fullStory}`;

      // 7. Save result
      await this.prisma.storyCompilation.update({
        where: { id: compilationId },
        data: {
          status: 'done',
          resultUrl: `data:text/plain;base64,${Buffer.from(finalStory).toString(
            'base64',
          )}`,
        },
      });
      await job.updateProgress(100, 'Compilation complete!');
    } catch (error) {
      console.error('Compilation failed:', error);
      await this.prisma.storyCompilation.update({
        where: { id: compilationId },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  private buildOutlinePrompt(project: any, entries: any[], emotionalAnalysis: any, pageRange: string, inspiration: string): string {
    const entriesSummary = entries
      .map(
        e =>
          `Date: ${e.createdAt
            .toISOString()
            .split('T')[0]}, Summary: ${e.title}`,
      )
      .join('\n');

    const chapterCount = this.getChapterCount(pageRange);

    return `
      You are a creative fiction author assistant. Based on the following journal entry summaries and emotional analysis, create a ${chapterCount}-chapter outline for a ${project.genre} story.
      The style should be inspired by ${inspiration || project.styleInspiration || 'a classic author'}.
      The overall emotional tone should be ${this.getEmotionalTone(emotionalAnalysis)}.
      The output must be a JSON array of objects, where each object has a "title" and a "summary" key.

      Here are the entry summaries:
      ${entriesSummary}
    `;
  }

  private buildChapterPrompt(
    project: any,
    entries: any[],
    chapterOutline: any,
    chapterNumber: number,
    emotionalAnalysis: any,
    pageRange: string,
    inspiration: string
  ): string {
    const entriesText = entries
      .map(
        e =>
          `Date: ${e.createdAt}\nTitle: ${e.title}\n${e.body}`,
      )
      .join('\n---\n');

    const wordCount = this.getWordCount(pageRange);

    return `
      You are a creative fiction author assistant. Write Chapter ${chapterNumber} of a ${project.genre} story.
      The story is inspired by ${inspiration || project.styleInspiration || 'a classic author'}.
      The emotional tone for this chapter should be ${this.getEmotionalTone(emotionalAnalysis)}.

      Here is the outline for this chapter:
      Title: ${chapterOutline.title}
      Summary: ${chapterOutline.summary}

      Using the original journal entries below as source material, write this chapter. The chapter should be approximately ${wordCount} words.

      Source Journal Entries:
      ${entriesText}
    `;
  }

  private getChapterCount(pageRange: string): number {
    switch (pageRange) {
      case '50-100':
        return 6;
      case '100-200':
        return 12;
      case '200-300':
        return 20;
      case '300+':
        return 30;
      default:
        return 6;
    }
  }

  private getWordCount(pageRange: string): number {
    switch (pageRange) {
      case '50-100':
        return 2000;
      case '100-200':
        return 4000;
      case '200-300':
        return 6000;
      case '300+':
        return 8000;
      default:
        return 2000;
    }
  }

  private getEmotionalTone(emotionalAnalysis: any): string {
    const emotions = emotionalAnalysis.emotions;
    let emotionalString = '';
    for (const emotion in emotions) {
      if (emotions[emotion] > 0) {
        emotionalString += `${emotion}: ${emotions[emotion]}, `;
      }
    }
    return emotionalString.slice(0, -2); // Remove trailing comma and space
  }
}
