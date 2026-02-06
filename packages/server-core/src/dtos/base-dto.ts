import { IsNumber } from 'class-validator';

export class BaseDto {
  @IsNumber()
  id!: number;
}
