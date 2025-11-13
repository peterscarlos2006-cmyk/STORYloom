import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as cron from 'node-cron';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notification-queue') private notificationQueue: Queue,
  ) {}

  onModuleInit() {
    // Schedule a task to run every minute to check for due notifications
    cron.schedule('* * * * *', async () => {
      console.log('Checking for due notifications...');
      const dueNotifications = await this.prisma.notification.findMany({
        where: {
          schedule: { lte: new Date() },
          deliveredAt: null,
        },
      });

      for (const notification of dueNotifications) {
        await this.notificationQueue.add('send-notification', {
          notificationId: notification.id,
          userId: notification.userId,
          channel: notification.channel,
          payload: notification.payload,
        });
      }
    });
  }

  async createReminder(userId: string, projectId: string, schedule: Date) {
    return this.prisma.notification.create({
      data: {
        userId,
        projectId,
        type: 'reminder',
        channel: 'email', // Default to email for now
        schedule,
        payload: { message: "Don't forget to write in your journal today!" },
      },
    });
  }
}