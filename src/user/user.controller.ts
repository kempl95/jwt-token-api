import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  Res, Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Observable } from 'rxjs';
import { ValidationPipe } from '../utils/validation.pipe';
import { TokenDTO } from './token.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRefreshDTO } from './user.refresh.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  public login(@Body(new ValidationPipe()) dto: UserDTO, @Res({ passthrough: true }) response: FastifyReply): Promise<TokenDTO> {
    return this.userService.login(dto, response);
  }

  @Post('/refresh')
  public refresh(@Body(new ValidationPipe()) dto: UserRefreshDTO, @Req() req: FastifyRequest): Promise<TokenDTO> {
    return this.userService.refresh(dto, req);
  }
}
