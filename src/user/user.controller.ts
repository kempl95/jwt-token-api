import {
  Body,
  Controller, Get, Param, Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from '../utils/validation.pipe';
import { UserDTO } from './user.dto';
import { Observable } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public getAll(): Observable<UserDTO[]> {
    return this.userService.findAll();
  }

  @Get('/login/:login')
  getUserByLogin(
    //ParseIntPipe - Конвейеры / Pipes - трансформация/валидация входных данных
    @Param('login')
      login: string,
  ): Observable<UserDTO> {
    return this.userService.findByLogin(login);
  }

  @Post()
  public post(@Body(new ValidationPipe()) dto: UserDTO): Promise<Observable<UserDTO>> {
    return this.userService.create(dto);
  }
}
