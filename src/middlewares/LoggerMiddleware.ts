import { Request, Response, NextFunction } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '@nestjs/common';
//middleware для внедрения чего-либо между запросом и контроллером
export function loggerMiddleware(req: FastifyRequest, res: FastifyReply, next: NextFunction) {
  //log any info about request:
  Logger.log(`Request: HOST: ${req.hostname.toString()}; METHOD: ${req.method}; URL: ${req.url}; `);
  next();
}
