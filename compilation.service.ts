import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { CreateCompilationDto } from './create-compilation.dto';

@Injectable()
export class CompilationService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('compilation-queue') private compilationQueue: Queue,
  ) {}

  async createCompilationJob(userId: string, projectId: string, createCompilationDto: CreateCompilationDto) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      throw new Error('Project not found or access denied.');
    }

    const compilation = await this.prisma.storyCompilation.create({
      data: {
        projectId,
        status: 'queued',
      },
    });

    await this.compilationQueue.add('compile-story', {
      compilationId: compilation.id,
      projectId,
      userId,
      pageRange: createCompilationDto.pageRange,
      inspiration: createCompilationDto.inspiration,
    });

    return compilation;
  }

  async getCompilationStatus(userId: string, compilationId: string) {
    const compilation = await this.prisma.storyCompilation.findFirst({
      where: { id: compilationId },
      include: {
        project: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (compilation.project.userId !== userId) {
      throw new Error('Access denied.');
    }

    return compilation;
  }
}
