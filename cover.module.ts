import { Module } from '@nestjs/common';
import { CoverService } from './cover.service';
import { CoverController } from './cover.controller';
import { BullModule } from '@nestjs/bull';
import { CoverProcessor } from './cover.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cover-queue',
    }),
  ],
  controllers: [CoverController],
  providers: [CoverService, CoverProcessor],
})
export class CoverModule {}