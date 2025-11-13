import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class JournalEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, projectId: string, dto: CreateEntryDto) {
    // Verify user owns the project
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      throw new NotFoundException('Project not found or access denied.');
    }
    const wordCount = dto.body.split(/\s+/).filter(word => word.length > 0).length;

    return this.prisma.journalEntry.create({
      data: {
        userId,
        projectId,
        title: dto.title,
        body: dto.body,
        wordCount,
        moodTag: dto.moodTag,
      },
    });
  }

  async findAllForProject(userId: string, projectId: string) {
    // Verify user owns the project
    await this.prisma.project.findFirstOrThrow({
      where: { id: projectId, userId },
    });
    
    return this.prisma.journalEntry.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}