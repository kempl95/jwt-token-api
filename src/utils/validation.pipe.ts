import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationException } from './validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorMessageArray = [];
      for (const error of errors) {
        let validationErrors = [];
        for (const constraintKey in error.constraints) {
          validationErrors.push(error.constraints[constraintKey]);
        }

        errorMessageArray.push({
          property: error.property,
          constraints: validationErrors.toString()
        })
      }
      throw new ValidationException(JSON.stringify(errorMessageArray), 401);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}