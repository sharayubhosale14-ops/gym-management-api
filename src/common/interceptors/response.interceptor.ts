import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request, Response } from 'express';

import {
  ApiResponse,
  ResponseMetadata,
} from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T | (ResponseMetadata & { data?: T }), ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | (ResponseMetadata & { data?: T })>,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((payload) => {
        const normalized = this.normalizePayload(payload);

        return {
          success: true,
          statusCode: response.statusCode,
          message: normalized.message,
          data: normalized.data,
          timestamp: new Date().toISOString(),
          path: request.originalUrl,
          method: request.method,
        };
      }),
    );
  }

  private normalizePayload(
    payload: T | (ResponseMetadata & { data?: T }),
  ): { message: string; data: T | null } {
    if (this.hasResponseMetadata(payload)) {
      return {
        message: payload.message ?? 'Request completed successfully',
        data: payload.data ?? null,
      };
    }

    return {
      message: 'Request completed successfully',
      data: payload ?? null,
    };
  }

  private hasResponseMetadata(
    payload: T | (ResponseMetadata & { data?: T }),
  ): payload is ResponseMetadata & { data?: T } {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
    );
  }
}
