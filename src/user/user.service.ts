import {
  HttpException,
  HttpStatus,
  Injectable, Logger, NotFoundException,
} from '@nestjs/common';
import { UserDTO } from './user.dto';
import { firstValueFrom, from, Observable, EMPTY, of, mergeMap, tap, throwIfEmpty, map } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Observable<UserDTO[]> {
    const resQuery = this.userRepository.find();
    return from(resQuery).pipe(
      map((objs) => { return UserDTO.fromList(objs, false) })
    );
  }

  public findByLogin(login: string): Observable<UserDTO> {
    const resQuery = this.userRepository.findOne({
      where: { login: login },
    });
    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntityWithoutPassword(obj)) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`User ${login} has not been found`),
      ),
    );
  }

  public async create(dto: UserDTO): Promise<Observable<UserDTO>> {

    const userRes = await firstValueFrom(from(this.userRepository.findOne({
      where: { login: dto.login }
    })).pipe())
    if (userRes) throw new HttpException(`User with login '${dto.login}' already exists`, HttpStatus.BAD_REQUEST)

    const resQuery = this.userRepository.save(UserDTO.toEntity(dto));

    return from(resQuery).pipe(
      mergeMap((obj) => (obj ? of(UserDTO.fromEntityWithoutPassword(obj)) : EMPTY)),
      throwIfEmpty(
        () => {
          Logger.log('Error create')
          throw new HttpException(`User has not been saved`, HttpStatus.BAD_REQUEST)
        }
      ),
      tap(val => Logger.log(`User '${dto.login}' created`))
    )
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
