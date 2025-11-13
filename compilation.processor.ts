import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAI } from 'openai';

interface CompilationJobData {
  compilationId: string;
  projectId: string;
  userId: string;
}

@Processor('compilation-queue')
export class CompilationProcessor {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(private prisma: PrismaService) {}

  @Process('compile-story')
  async handleCompilation(job: Job<CompilationJobData>) {
    const { compilationId, projectId } = job.data;
    await job.updateProgress(5);

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
      await job.updateProgress(15);

      // 3. Generate Outline
      const outlinePrompt = this.buildOutlinePrompt(project, entries);
      const outlineCompletion = await this.openai.chat.completions.create({
        model: 'gpt-4', // Use a more capable model for outlining
        messages: [{ role: 'user', content: outlinePrompt }],
      });
      const outline = JSON.parse(
        outlineCompletion.choices[0].message.content || '[]',
      );
      await this.prisma.storyCompilation.update({
        where: { id: compilationId },
        data: { outline },
      });
      await job.updateProgress(30);

      // 4. Generate Chapters
      const chapters = [];
      for (let i = 0; i < outline.length; i++) {
        const chapter = outline[i];
        const chapterPrompt = this.buildChapterPrompt(
          project,
          entries,
          chapter,
          i + 1,
        );
        const chapterCompletion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: chapterPrompt }],
        });
        chapters.push(chapterCompletion.choices[0].message.content || '');
        await job.updateProgress(30 + (60 / outline.length) * (i + 1));
      }

      // 5. Assemble and Post-process
      const fullStory = chapters.join('\n\n---\n\n');
      const toc = outline
        .map((o: any, i: number) => `Chapter ${i + 1}: ${o.title}`)
        .join('\n');
      const finalStory = `Table of Contents:\n${toc}\n\n${fullStory}`;

      // 6. Save result
      await this.prisma.storyCompilation.update({
        where: { id: compilationId },
        data: {
          status: 'done',
          resultUrl: `data:text/plain;base64,${Buffer.from(finalStory).toString(
            'base64',
          )}`,
        },
      });
      await job.updateProgress(100);
    } catch (error) {
      console.error('Compilation failed:', error);
      await this.prisma.storyCompilation.update({
        where: { id: compilationId },
        data: { status: 'failed' },
      });
      throw error; // Re-throw to mark job as failed in BullMQ
    }
  }

  private buildOutlinePrompt(project: any, entries: any[]): string {
    const entriesSummary = entries
      .map(
        e =>
          `Date: ${e.createdAt
            .toISOString()
            .split('T')[0]}, Summary: ${e.title}`,
      )
      .join('\n');
    return `
      You are a creative fiction author assistant. Based on the following journal entry summaries, create a 6-chapter outline for a ${project.genre} short story.
      The style should be inspired by ${project.styleInspiration ||
        'a classic author'}.
      The output must be a JSON array of objects, where each object has a "title" and a "summary" key.
      Example: [{"title": "The Mysterious Letter", "summary": "The protagonist receives a cryptic letter that changes everything."}, ...]
      
      Here are the entry summaries:
      ${entriesSummary}
    `;
  }

  private buildChapterPrompt(
    project: any,
    entries: any[],
    chapterOutline: any,
    chapterNumber: number,
  ): string {
    const relevantEntries = entries; // In a real app, you might filter entries relevant to this chapter
    const entriesText = relevantEntries
      .map(
        e =>
          `Date: ${e.createdAt}\nTitle: ${e.title}\n${e.body}`,
      )
      .join('\n---\n');

    return `
      You are a creative fiction author assistant. Write Chapter ${chapterNumber} of a ${project.genre} story.
      The story is inspired by ${project.styleInspiration ||
        'a classic author'}.
      
      Here is the outline for this chapter:
      Title: ${chapterOutline.title}
      Summary: ${chapterOutline.summary}
      
      Using the original journal entries below as source material, write this chapter. Ensure a consistent narrative voice and emotional tone. The chapter should be between 800 and 1500 words.
      
      Source Journal Entries:
      ${entriesText}
    `;
  }
}