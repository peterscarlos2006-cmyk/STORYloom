import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompilationDto {
  @IsString()
  @IsNotEmpty()
  pageRange: string;

  @IsString()
  inspiration: string;
}
