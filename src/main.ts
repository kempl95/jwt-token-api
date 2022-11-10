import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import fastifyCookie from '@fastify/cookie';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  // Втроим обработчик исключений AllExceptionsFilter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(3030);
}
bootstrap();
