import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDTO } from './user/user.dto';
import { ValidationPipe } from './utils/validation.pipe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenDTO } from './user/token.dto';
import { UserRefreshDTO } from './user/user.refresh.dto';
import { AccessUserDTO } from './user/access.user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/access')
  public login(@Body(new ValidationPipe()) dto: AccessUserDTO, @Res({ passthrough: true }) response: FastifyReply): Promise<TokenDTO> {
    return this.appService.access(dto, response);
  }

  @Post('/refresh')
  public refresh(@Body(new ValidationPipe()) dto: UserRefreshDTO, @Req() req: FastifyRequest): Promise<TokenDTO> {
    return this.appService.refresh(dto, req);
  }
}
