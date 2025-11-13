import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsOptional()
  styleInspiration?: string;

  @IsInt()
  journalingPeriod: number;

  @IsDateString()
  startDate: string;
}