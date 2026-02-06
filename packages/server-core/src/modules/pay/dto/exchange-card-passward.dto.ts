import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ExchangeCardPasswardDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10) // 限制卡密长度为10位
  cardPassword!: string;
}
