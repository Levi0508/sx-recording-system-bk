import { IsOptional } from 'class-validator';
import { AVATAR_TYPE_ENUM } from 'src/enum';

export class AvatarFrameTypeDTO {
  @IsOptional()
  avatar_frame_type?: AVATAR_TYPE_ENUM;
}
