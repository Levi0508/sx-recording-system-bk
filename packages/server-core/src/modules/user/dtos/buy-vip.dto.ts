import { IsNotEmpty, IsOptional } from 'class-validator';

export class BuyVipDTO {
  @IsNotEmpty()
  goodsId!: string;

  @IsOptional()
  isWear?: boolean;
}
