import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSystemNotificationDto {
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  email?: string;
}
