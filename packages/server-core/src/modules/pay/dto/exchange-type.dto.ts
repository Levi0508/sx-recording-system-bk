import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class ExchangeTypeDto {
  @IsNumber()
  @IsNotEmpty()
  @IsIn([10, 30, 50, 68, 80, 200, 500])
  cardType!: number;
}
