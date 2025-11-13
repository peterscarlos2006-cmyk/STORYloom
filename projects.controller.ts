import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// We assume the JWT strategy adds user payload to the request object
export interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string };
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @Req() req: AuthenticatedRequest) {
    return this.projectsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.projectsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.projectsService.findOne(req.user.userId, id);
  }
}