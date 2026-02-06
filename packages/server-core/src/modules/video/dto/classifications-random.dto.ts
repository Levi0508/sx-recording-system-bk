import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { VIDEO_TYPE_ENUM } from 'src/enum';

export class ClassificationsRandomVideoDto {
  @IsNotEmpty()
  classification!: VIDEO_TYPE_ENUM; // 新增的字段，用于接收视频类型

  @IsNumber()
  @IsOptional()
  take?: number;
}
