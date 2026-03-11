import {
  IsString,
  IsInt,
  IsOptional,
  IsObject,
  IsNotEmpty,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  topic!: string;

  @IsInt()
  @IsNotEmpty()
  type!: 1 | 2;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  start_time?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  timezone?: string;

  @IsOptional()
  @IsObject()
  settings?: {
    join_before_host?: boolean;
    waiting_room?: boolean;
    mute_upon_entry?: boolean;
    password?: string;
  };
}
