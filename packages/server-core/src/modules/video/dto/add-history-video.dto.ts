import { IsNotEmpty, IsOptional } from 'class-validator';
import { VIDEO_TYPE_ENUM } from 'src/enum';

export class AddHistoryOrFavoriteVideoDto {
  @IsNotEmpty()
  videoId!: number;

  @IsOptional()
  classification?: VIDEO_TYPE_ENUM;
}
