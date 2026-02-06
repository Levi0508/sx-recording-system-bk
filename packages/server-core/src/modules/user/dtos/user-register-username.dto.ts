import { IsNotEmpty, isNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UserLoginInUserNameDTO {
  @IsNotEmpty()
  email!: string;
  @IsNotEmpty()
  password!: string;
}
export class UserAddVipDTO {
  @IsNotEmpty()
  email!: string;
  @IsNotEmpty()
  days!: number;
  @IsOptional()
  type?: string;
}

export class UserRegisterUserNameDTO {
  @IsNotEmpty()
  password!: string;
  @IsNotEmpty()
  code!: string;
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  invitationCode?: string;
}

export class UserResetPasswordDTO {
  // @IsNotEmpty()
  // username!: string;
  @IsNotEmpty()
  password!: string;
  // @IsNotEmpty()
  // newPassword!: string;
  @IsNotEmpty()
  code!: string;
  @IsNotEmpty()
  email!: string;
}
