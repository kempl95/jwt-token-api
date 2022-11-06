import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDTO {
  @ApiProperty({ required: true })
  access: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  refresh: string;

  constructor(access, refresh) {
    this.access = access;
    this.refresh = refresh;
  }
}
