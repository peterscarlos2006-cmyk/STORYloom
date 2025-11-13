import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateProjectDto) {
    // Calculate end date from start date and period
    const startDate = new Date(dto.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + dto.journalingPeriod);

    return this.prisma.project.create({
      data: {
        userId,
        title: dto.title,
        genre: dto.genre,
        styleInspiration: dto.styleInspiration,
        journalingPeriod: dto.journalingPeriod,
        startDate: startDate,
        endDate: endDate,
      },
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(userId: string, projectId: string) {
    return this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
  }
}