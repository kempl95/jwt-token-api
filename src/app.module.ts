import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { User } from './user/user.model';
import { DataGenerator } from './utils/data.generator';
import { UserController } from './user/user.controller';
import { loggerMiddleware } from './middlewares/LoggerMiddleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataGenerator],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes(UserController, AppController);
  }
}
