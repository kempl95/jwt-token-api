import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { Observable, from, mergeMap, throwIfEmpty, of, EMPTY } from 'rxjs';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenDTO } from './token.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}



  public async login(dto: UserDTO): Promise<TokenDTO> {
    try {
      const resQuery = await this.userRepository.findBy({ login: dto.login });
      if (resQuery === null) throw new HttpException(`Invalid credentials. Have not found user ${dto.login}`, 406);

      const userData = resQuery[0];

      const isMatch = await bcrypt.compare(dto.password, userData.password);
      if (!isMatch) throw new HttpException(`Invalid credentials. wrong password`, 406);
      if (userData.email !== dto.email) throw new HttpException(`Invalid credentials. wrong email`, 406);

      //creating a access token
      const accessToken = jwt.sign({
        username: userData.login,
        email: userData.email
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
      });
      // Creating refresh token not that expiry of refresh
      //token is greater than the access token

      const refreshToken = jwt.sign({
        username: userData.login,
      }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });


      return new TokenDTO(accessToken, refreshToken);

    }
    catch (e) {
      throw new HttpException(e.message(), 400);
    }
  }
}
