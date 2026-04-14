import { BadRequestException, ValidationPipe as NestValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/** Global validation pipe with structured error output. */
export const globalValidationPipe = new NestValidationPipe({
  whitelist:            true,
  forbidNonWhitelisted: true,
  transform:            true,
  transformOptions:     { enableImplicitConversion: true },
  exceptionFactory: (errors: ValidationError[]) => {
    const details: Record<string, string> = {};

    const flatten = (errs: ValidationError[], prefix = ''): void => {
      for (const err of errs) {
        const field = prefix ? `${prefix}.${err.property}` : err.property;
        if (err.constraints) {
          details[field] = Object.values(err.constraints).join('; ');
        }
        if (err.children?.length) {
          flatten(err.children, field);
        }
      }
    };

    flatten(errors);

    return new BadRequestException({
      code:    'VALIDATION_ERROR',
      message: 'Request validation failed',
      details,
    });
  },
});
