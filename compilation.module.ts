import { Module } from '@nestjs/common';
import { CompilationService } from './cover.service';
import { CompilationController } from './compilation.controller';
import { BullModule } from '@nestjs/bull';
import { CompilationProcessor } from './compilation.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'compilation-queue',
    }),
  ],
  controllers: [CompilationController],
  providers: [CompilationService, CompilationProcessor],
})
export class CompilationModule {}