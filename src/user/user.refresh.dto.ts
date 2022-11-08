import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserRefreshDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({always: true , message: 'empty'})
  login: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  constructor(partial: Partial<UserRefreshDTO>) {
    Object.assign(this, partial);
  }
}
