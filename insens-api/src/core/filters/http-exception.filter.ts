import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request  = ctx.getRequest<FastifyRequest>();

    // Guard: if Fastify has already sent the response, do nothing
    if (response.sent) return;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let code    = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, unknown> = {};

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const res = exceptionResponse as Record<string, unknown>;
      code    = (res['code']    as string)  ?? mapStatusToCode(status);
      message = (res['message'] as string)  ?? message;

      // Validation errors: NestJS puts them in `message` array
      if (Array.isArray(res['message'])) {
        message = 'Validation failed';
        details = { errors: res['message'] };
        code    = 'VALIDATION_ERROR';
      } else {
        details = (res['details'] as Record<string, unknown>) ?? {};
      }
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      code    = mapStatusToCode(status);
    }

    response.status(status).send({
      success: false,
      error: {
        code,
        message,
        details,
        requestId: uuidv4(),
        path:      request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

function mapStatusToCode(status: number): string {
  const map: Record<number, string> = {
    400: 'VALIDATION_ERROR',
    401: 'AUTH_TOKEN_INVALID',
    403: 'FORBIDDEN',
    404: 'RESOURCE_NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE',
    500: 'INTERNAL_ERROR',
  };
  return map[status] ?? 'INTERNAL_ERROR';
}
