import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDTO implements Readonly<UserDTO> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({always: true , message: 'empty'})
  login: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
