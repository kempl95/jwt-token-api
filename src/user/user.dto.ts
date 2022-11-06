import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDTO implements Readonly<UserDTO> {
  @ApiProperty({ required: true })
  @IsString()
  login: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
