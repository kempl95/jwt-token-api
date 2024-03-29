import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from './user.model';
import { Column } from 'typeorm';

export class UserDTO implements Readonly<UserDTO> {
  @ApiProperty({ required: false })
  id: number;

  @ApiProperty({ required: true })
  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({always: true , message: 'empty'})
  login: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  email: string;

  public static fromEntity(entity: User) {
    return new UserDTO({
      id: entity.id,
      name: entity.name,
      login: entity.login,
      password: entity.password,
    });
  }

  public static fromEntityWithoutPassword(entity: User) {
    return new UserDTO({
      id: entity.id,
      name: entity.name,
      login: entity.login,
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

  public static toEntity(dto: UserDTO) {
    return new User({
      name: dto.name,
      login: dto.login,
      password: dto.password,
    });
  }

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
