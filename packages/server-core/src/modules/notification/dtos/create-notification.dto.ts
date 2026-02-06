import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { VIDEO_TYPE_ENUM } from 'src/enum';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNumber()
  @IsOptional()
  videoId?: number;

  @IsString()
  @IsOptional()
  classification?: VIDEO_TYPE_ENUM;

  @IsNotEmpty()
  userId!: number; //收件人

  @IsNotEmpty()
  type!: string; //邮件类型 video/system/user
}
