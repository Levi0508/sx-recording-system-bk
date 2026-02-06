import { IsNotEmpty } from 'class-validator';

export class ConvertVipDTO {
  @IsNotEmpty()
  email!: string;
}
