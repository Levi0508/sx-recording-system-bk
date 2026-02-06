import { IsInt, IsOptional, Min } from 'class-validator';

export class UserListDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  currentPage?: number = 1; // 默认页码为1

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 60; // 默认每页显示10条记录

  @IsOptional()
  nickname?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  ip?: string;

  @IsOptional()
  isVip?: string;

  @IsOptional()
  facility?: string;

  @IsOptional()
  id?: string;
}
