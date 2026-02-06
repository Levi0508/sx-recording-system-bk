import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class ExchangeCardDto {
  @IsNumber()
  @IsNotEmpty()
  count!: number;

  @IsNumber()
  @IsNotEmpty()
  @IsIn([10, 30, 50, 68, 80, 200, 500])
  cardType!: number;
}
