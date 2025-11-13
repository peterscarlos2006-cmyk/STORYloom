import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../projects/projects.controller';

@Controller('projects/:projectId/entries')
@UseGuards(JwtAuthGuard)
export class JournalEntriesController {
  constructor(private readonly entriesService: JournalEntriesService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateEntryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.entriesService.create(req.user.userId, projectId, dto);
  }

  @Get()
  findAll(@Param('projectId') projectId: string, @Req() req: AuthenticatedRequest) {
    return this.entriesService.findAllForProject(req.user.userId, projectId);
  }
}