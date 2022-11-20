import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenDTO } from './user/token.dto';
import { UserRefreshDTO } from './user/user.refresh.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.model';
import { Repository } from 'typeorm';
import { firstValueFrom, from} from 'rxjs';
import { AccessUserDTO } from './user/access.user.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async access(dto: AccessUserDTO, res: FastifyReply): Promise<TokenDTO> {
    // const { data } = await firstValueFrom(
    //   this.httpService.get<UserDTO>(`${process.env.SERVER_APP_URL}:${process.env.SERVER_APP_PORT}/jwt/users/login/${dto.login}`).pipe(),
    // );

    const userData = await firstValueFrom(from(this.userRepository.findOne({
      where: { login: dto.login }
    })).pipe())
    if (!userData) throw new HttpException(`Invalid credentials. User with login '${dto.login}' does not exist`, HttpStatus.UNAUTHORIZED)
    const isMatch = await bcrypt.compare(dto.password, userData.password);
    if (!isMatch) throw new HttpException(`Invalid credentials. Wrong password`, HttpStatus.UNAUTHORIZED);

    //creating a access token
    const accessToken = jwt.sign({
      login: userData.login
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    });
    // Creating refresh token not that expiry of refresh
    //token is greater than the access token

    const refreshToken = jwt.sign({
      login: userData.login,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    // Assigning refresh token in http-only cookie
    res.setCookie('jwt', refreshToken, { httpOnly: true,
      sameSite: 'none', secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000 });
    return new TokenDTO(accessToken, refreshToken);
  }

  public async refresh(dto: UserRefreshDTO, req: FastifyRequest): Promise<TokenDTO> {
    // //ToDo: Later: Add access token to request in order to protect it
    // const { data } = await firstValueFrom(
    //   this.httpService.get<UserDTO>(`${process.env.SERVER_APP_URL}:${process.env.SERVER_APP_PORT}/jwt/users/login/${dto.login}`).pipe(),
    // );
    const userData = await firstValueFrom(from(this.userRepository.findOne({
      where: { login: dto.login }
    })).pipe())

    if (userData) throw new HttpException(`User with login '${dto.login}' already exists`, HttpStatus.UNAUTHORIZED)

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
      login: userData.login
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    });
    return new TokenDTO(accessToken, refreshToken);
  }
}
