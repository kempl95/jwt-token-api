import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit, Response,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { Observable, from, mergeMap, throwIfEmpty, of, EMPTY } from 'rxjs';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenDTO } from './token.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FastifyReply } from 'fastify';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  public async login(dto: UserDTO, res: FastifyReply): Promise<TokenDTO> {
    try {
      //ToDo: Later: Add access token to request in order to protect it
      const { data } = await firstValueFrom(
        this.httpService.get<UserDTO>(`${process.env.SERVER_APP_URL}:${process.env.SERVER_APP_PORT}/jwt/users/login/${dto.login}`).pipe(),
      );

      if (data === null) throw new HttpException(`Invalid credentials. Have not found user ${dto.login}`, 406);
      const userData = data;
      const isMatch = await bcrypt.compare(dto.password, userData.password);
      if (!isMatch) throw new HttpException(`Invalid credentials. wrong password`, 406);
      if (userData.email !== dto.email) throw new HttpException(`Invalid credentials. wrong email`, 406);

      //creating a access token
      const accessToken = jwt.sign({
        username: userData.login,
        email: userData.email,
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
      });
      // Creating refresh token not that expiry of refresh
      //token is greater than the access token

      const refreshToken = jwt.sign({
        username: userData.login,
      }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

      // Assigning refresh token in http-only cookie
      res.setCookie('jwt', refreshToken, { httpOnly: true,
        sameSite: 'none', secure: true,
        maxAge: 24 * 60 * 60 * 1000 });

      return new TokenDTO(accessToken, refreshToken);

    }
    catch (e) {
      throw new HttpException(e.message(), 400);
    }
  }
}
