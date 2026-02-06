import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class TypeNotificationDto {
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  currentPage?: number = 1; // 默认页码为1

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10; // 默认每页显示60条记录
}
