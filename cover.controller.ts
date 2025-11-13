import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { CoverService } from './cover.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../projects/projects.controller';

@Controller('projects/:projectId/cover')
@UseGuards(JwtAuthGuard)
export class CoverController {
  constructor(private readonly coverService: CoverService) {}

  @Post('generate')
  async generate(
    @Param('projectId') projectId: string,
    @Body('prompt') prompt: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coverService.createCoverJob(req.user.userId, projectId, prompt);
  }

  @Get()
  async findAll(
    @Param('projectId') projectId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coverService.findProjectCovers(req.user.userId, projectId);
  }

  @Post(':coverId/apply')
  async apply(
    @Param('projectId') projectId: string,
    @Param('coverId') coverId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coverService.applyCoverToProject(
      req.user.userId,
      projectId,
      coverId,
    );
  }
}