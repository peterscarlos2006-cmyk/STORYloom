import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  moodTag?: string;
}