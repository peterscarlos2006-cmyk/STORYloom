import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { CompilationModule } from './compilation/compilation.module';
import { CoverModule } from './cover/cover.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    JournalEntriesModule,
    CompilationModule,
    CoverModule,
    NotificationsModule,
    EseModule,
    LibraryModule,
  ],
})
export class AppModule {}