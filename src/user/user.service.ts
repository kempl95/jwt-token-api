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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}



  public async login(dto: UserDTO): Promise<UserDTO> {
    const resQuery = await this.userRepository.find({ where: { login: dto.login } });
    if (resQuery === null) {

    }


    //   if (dto.login === resQuery.login && password === resQuery.password) {
    //
    //   }
    //     if (dto.login === userCredentials.username &&
    //       password === userCredentials.password) {
    //
    //       //creating a access token
    //       const accessToken = jwt.sign({
    //         username: userCredentials.username,
    //         email: userCredentials.email
    //       }, process.env.ACCESS_TOKEN_SECRET, {
    //         expiresIn: '10m'
    //       });
    //       // Creating refresh token not that expiry of refresh
    //       //token is greater than the access token
    //
    //       const refreshToken = jwt.sign({
    //         username: userCredentials.username,
    //       }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    //
    //       // Assigning refresh token in http-only cookie
    //       res.cookie('jwt', refreshToken, { httpOnly: true,
    //         sameSite: 'None', secure: true,
    //         maxAge: 24 * 60 * 60 * 1000 });
    //       return res.json({ accessToken });
    //     }
    //   }
    // }
    //
    //   // Checking if credentials match
    //
    //   else {
    //     // Return unauthorized error if credentials don't match
    //     return res.status(406).json({
    //       message: 'Invalid credentials' });
    //   }
    return dto;
  }
}
