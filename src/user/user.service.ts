import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenDTO } from './token.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRefreshDTO } from './user.refresh.dto';

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
        sameSite: 'none', secure: false,
        maxAge: 24 * 60 * 60 * 1000 });

      return new TokenDTO(accessToken, refreshToken);

    }
    catch (e) {
      throw new HttpException(e.message(), 400);
    }
  }

  public async refresh(dto: UserRefreshDTO, req: FastifyRequest): Promise<TokenDTO> {
    try {
      //ToDo: Later: Add access token to request in order to protect it
      const { data } = await firstValueFrom(
        this.httpService.get<UserDTO>(`${process.env.SERVER_APP_URL}:${process.env.SERVER_APP_PORT}/jwt/users/login/${dto.login}`).pipe(),
      );

      if (data === null) throw new HttpException(`Invalid credentials. Have not found user ${dto.login}`, 406);
      const userData = data;

      if (!req.headers['cookie']) throw new HttpException(`Refresh token should be in headers. key=cookie, value=refreshTokenData`, 406);

      // Destructuring refreshToken from cookie
      const refreshToken = req.headers['cookie'].substr(req.headers['cookie'].indexOf('=')+1, req.headers['cookie'].length);
      if (!refreshToken) throw new HttpException(`Refresh token should be in cookies with name 'jwt'`, 406);

      // Verifying refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) throw new HttpException(`Invalid refresh token`, HttpStatus.UNAUTHORIZED);
      })
      // Correct token we send a new access token
      const accessToken = jwt.sign({
        username: userData.login,
        email: userData.email
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
      });
      return new TokenDTO(accessToken, refreshToken);
    }
    catch (e) {
      throw new HttpException(e.message(), 400);
    }
  }
}
