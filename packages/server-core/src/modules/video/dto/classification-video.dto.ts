import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { FILTER_ENUM, VIDEO_TYPE_ENUM } from 'src/enum';

export class ClassificationVideoDto {
  @IsOptional()
  classification?: VIDEO_TYPE_ENUM; // 新增的字段，用于接收视频类型

  @IsOptional()
  title?: string; // 新增的字段，用于接收视频类型

  @IsOptional()
  filename?: string; // 新增的字段，用于接收视频类型

  @IsNotEmpty()
  sortType!: FILTER_ENUM;

  @IsOptional()
  @IsInt()
  @Min(1)
  currentPage?: number = 1; // 默认页码为1

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 60; // 默认每页显示10条记录
}
