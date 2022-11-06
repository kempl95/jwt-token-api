import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Observable } from 'rxjs';
import { ValidationPipe } from '../utils/validation.pipe';
import { TokenDTO } from './token.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  public login(@Body(new ValidationPipe()) dto: UserDTO): Promise<TokenDTO> {
    return this.userService.login(dto);
  }
}
