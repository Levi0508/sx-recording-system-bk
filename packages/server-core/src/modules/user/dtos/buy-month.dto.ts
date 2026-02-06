import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class BuyMonthDTO {
  @IsNotEmpty()
  goodsId!: string;

  @IsOptional()
  @IsBoolean()
  includeUpdate?: boolean; //是否包后续更新（仅用于anchor类型）
}
