import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notifications.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification-queue',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationProcessor],
})
export class NotificationsModule {}