import { IsOptional, IsNumber, IsString } from 'class-validator';

export class ExchangeQueryDTO {
  @IsOptional()
  @IsNumber()
  id?: number; // 用户ID

  @IsOptional()
  @IsString()
  email?: string; // 用户邮箱

  @IsOptional()
  @IsNumber()
  currentPage?: number; // 当前页码

  @IsOptional()
  @IsNumber()
  pageSize?: number; // 每页数量
}
