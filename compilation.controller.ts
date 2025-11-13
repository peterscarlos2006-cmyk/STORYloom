import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { CompilationService } from './cover.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../projects/projects.controller';

@Controller('projects/:projectId/compilations')
@UseGuards(JwtAuthGuard)
export class CompilationController {
  constructor(private readonly compilationService: CompilationService) {}

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.compilationService.createCompilationJob(
      req.user.userId,
      projectId,
    );
  }

  @Get(':compilationId')
  async findOne(
    @Param('compilationId') compilationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.compilationService.getCompilationStatus(
      req.user.userId,
      compilationId,
    );
  }
}