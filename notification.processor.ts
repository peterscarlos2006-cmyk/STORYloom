import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

interface NotificationJobData {
  notificationId: string;
  userId: string;
  channel: string;
  payload: any;
}

@Processor('notification-queue')
export class NotificationProcessor {
  constructor(private prisma: PrismaService) {}

  @Process('send-notification')
  async handleSendNotification(job: Job<NotificationJobData>) {
    const { notificationId, channel, payload } = job.data;
    console.log(`Sending ${channel} notification:`, payload);

    // Placeholder for actual sending logic
    if (channel === 'email') {
      // await this.sendGridService.send({ ... });
      console.log('Email sent.');
    } else if (channel === 'push') {
      // await this.fcmService.send({ ... });
      console.log('Push notification sent.');
    }

    // Mark as delivered
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { deliveredAt: new Date() },
    });
  }
}