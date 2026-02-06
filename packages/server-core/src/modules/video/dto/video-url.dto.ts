import { IsNotEmpty } from 'class-validator';

export class VideoIdDto {
  @IsNotEmpty()
  id!: number;
}
