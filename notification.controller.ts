import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../projects/projects.controller';
import { IsDateString, IsString } from 'class-validator';

class CreateReminderDto {
  @IsString()
  projectId: string;

  @IsDateString()
  schedule: string; // ISO string
}

@Controller('users/me/reminders')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() dto: CreateReminderDto, @Req() req: AuthenticatedRequest) {
    return this.notificationsService.createReminder(
      req.user.userId,
      dto.projectId,
      new Date(dto.schedule),
    );
  }
}