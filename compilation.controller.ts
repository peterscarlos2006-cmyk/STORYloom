import { Controller, Post, Get, Param, UseGuards, Req, Body } from '@nestjs/common';
import { CompilationService } from './compilation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../projects/projects.controller';
import { CreateCompilationDto } from './create-compilation.dto';

@Controller('projects/:projectId/compilations')
@UseGuards(JwtAuthGuard)
export class CompilationController {
  constructor(private readonly compilationService: CompilationService) {}

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Req() req: AuthenticatedRequest,
    @Body() createCompilationDto: CreateCompilationDto,
  ) {
    return this.compilationService.createCompilationJob(
      req.user.userId,
      projectId,
      createCompilationDto,
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
