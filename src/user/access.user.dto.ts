import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from './user.model';
import { Column } from 'typeorm';
import { UserDTO } from './user.dto';

export class AccessUserDTO {
    @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({always: true , message: 'empty'})
  login: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  public static fromEntity(entity: User) {
    return new UserDTO({
      login: entity.login,
      password: entity.password,
    });
  }

  public static fromList(userList: User[], withPassword: boolean) {
    let list = [];
    for (const user of userList) {
      if (withPassword) list.push(UserDTO.fromEntity(user))
      else list.push(UserDTO.fromEntityWithoutPassword(user))
    }
    return list;
  }

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
