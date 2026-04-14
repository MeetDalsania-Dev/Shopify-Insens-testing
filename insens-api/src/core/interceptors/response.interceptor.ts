import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map }        from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data:    T;
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the handler returns an object with an explicit `message` field
        // (e.g. { message: '...', ...rest }), surface it on the envelope.
        if (data && typeof data === 'object' && 'message' in (data as object)) {
          const { message, ...rest } = data as { message?: string; [k: string]: unknown };
          return { success: true, data: rest as unknown as T, message };
        }
        return { success: true, data };
      }),
    );
  }
}
