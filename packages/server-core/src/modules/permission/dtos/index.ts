import { IsNumber, IsString } from 'class-validator';

export class RoleCreateDTO {
  @IsString()
  name!: string;
  @IsString()
  description!: string;
}

export class RoleUpdateDTO extends RoleCreateDTO {
  @IsNumber()
  id!: number;
}

export class PolicyCreateDTO {
  @IsString()
  name!: string;
  @IsString()
  description!: string;
  @IsString()
  statement!: string;
}

export class PolicyUpdateDTO extends PolicyCreateDTO {
  @IsNumber()
  id!: number;
}
