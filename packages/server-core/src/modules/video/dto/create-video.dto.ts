import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VIDEO_TYPE_ENUM } from 'src/enum';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsEnum(VIDEO_TYPE_ENUM, {
    message: '入参classification不在规定范围',
  })
  classification!: VIDEO_TYPE_ENUM; // 新增的字段，用于接收视频类型
}
