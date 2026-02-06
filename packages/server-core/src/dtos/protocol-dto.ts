import { IsNotEmpty, IsString } from 'class-validator';

export type Protocol = ProtocolDTo;

export class ProtocolDTo {
  @IsString()
  passport!: string;
  @IsString()
  session!: string;
  @IsNotEmpty()
  resource!: any;
  @IsString()
  sign!: string;
  @IsNotEmpty()
  other!: any;
}
