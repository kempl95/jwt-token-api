import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { User } from '../user/user.model';

@Injectable()
export class DataGenerator implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.generate();
  }

  public async generate(): Promise<void> {
    const userQueryLength = await this.userRepository.count();
    if (userQueryLength === 0) {
      await this.generateStaticUsers();
      await this.generateUsers();
    }
  }

  public async generateUsers(): Promise<void> {
    const users = [];
    for (let i = 0; i < 5; i++) {

      const firstName = faker.name.firstName('male');
      const lastName = faker.name.lastName('male');
      const password = await bcrypt.hash(`${firstName} ${lastName}`, 10);
      users.push(
        new User({
          name: `${firstName} ${lastName}`,
          login: `${firstName}_${lastName}`,
          password: password,
        }),
      );
    }
    await this.userRepository.save(users);
  }

  public async generateStaticUsers(): Promise<void> {
    const password = await bcrypt.hash(`admin`, 10);

     const user = new User( {
       name: 'Admin',
       login: 'admin',
       password: password,
     });
    await this.userRepository.save(user);
  }
}
