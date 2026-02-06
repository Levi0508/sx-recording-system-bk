import { IsNotEmpty, IsOptional } from 'class-validator';
import { AVATAR_TYPE_ENUM } from 'src/enum';

export class AvatarFrameDTO {
  @IsNotEmpty()
  goodsId!: AVATAR_TYPE_ENUM;

  @IsOptional()
  isWear?: boolean;
}
