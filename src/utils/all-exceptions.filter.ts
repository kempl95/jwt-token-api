import {
  ArgumentsHost, BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { ValidationException } from './validation.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: AbstractHttpAdapter<any, any, any>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const httpAdapter = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = 400;
    if (exception instanceof ValidationException) httpStatus = exception.status;
    if (exception instanceof HttpException) httpStatus = exception.getStatus();

    let message = 'Server error';
    if (exception instanceof ValidationException) message = exception.message;
    if (exception instanceof HttpException) message = exception.getResponse().toString();

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
