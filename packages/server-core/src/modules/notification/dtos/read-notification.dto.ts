import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReadNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  notificationId!: number;
}
