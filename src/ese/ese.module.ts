import { Module } from '@nestjs/common';
import { EseService } from './ese.service';

@Module({
  providers: [EseService],
  exports: [EseService],
})
export class EseModule {}
