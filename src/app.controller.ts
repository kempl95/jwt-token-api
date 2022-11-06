import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDTO } from './user/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
