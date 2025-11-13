import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class CoverService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('cover-queue') private coverQueue: Queue,
  ) {}

  async createCoverJob(userId: string, projectId: string, prompt: string) {
    // Verify user owns the project
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      throw new Error('Project not found or access denied.');
    }

    const coverAsset = await this.prisma.coverAsset.create({
      data: {
        projectId,
        generatedBy: 'ai',
        promptUsed: prompt,
      },
    });

    await this.coverQueue.add('generate-cover', {
      coverAssetId: coverAsset.id,
      prompt,
    });

    return coverAsset;
  }

  async findProjectCovers(userId: string, projectId: string) {
    await this.prisma.project.findFirstOrThrow({
      where: { id: projectId, userId },
    });
    return this.prisma.coverAsset.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async applyCoverToProject(userId: string, projectId: string, coverId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) throw new Error('Project not found');

    const cover = await this.prisma.coverAsset.findFirst({
      where: { id: coverId, projectId },
    });
    if (!cover) throw new Error('Cover not found');

    await this.prisma.project.update({
      where: { id: projectId },
      data: { metadata: { ...project.metadata, coverId: cover.id } },
    });
    return { success: true };
  }
}