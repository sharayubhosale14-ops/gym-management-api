import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiErrorResponse } from '../interfaces/api-error-response.interface';

interface HttpExceptionBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const statusCode = this.getStatusCode(exception);
    const exceptionResponse = this.getExceptionResponse(exception);
    const message = this.getMessage(exceptionResponse, exception);
    const error = this.getError(exceptionResponse, statusCode);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        message,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      method: request.method,
    };

    const details = this.getDetails(exceptionResponse);

    if (details) {
      errorResponse.details = details;
    }

    response.status(statusCode).json(errorResponse);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getExceptionResponse(exception: unknown): string | HttpExceptionBody {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      return typeof response === 'string' ? response : (response as HttpExceptionBody);
    }

    return {};
  }

  private getMessage(
    exceptionResponse: string | HttpExceptionBody,
    exception: unknown,
  ): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.join(', ');
    }

    if (exceptionResponse.message) {
      return exceptionResponse.message;
    }

    if (exception instanceof Error && exception.message) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private getError(
    exceptionResponse: string | HttpExceptionBody,
    statusCode: number,
  ): string {
    if (typeof exceptionResponse !== 'string' && exceptionResponse.error) {
      return exceptionResponse.error;
    }

    return statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
      ? 'Internal Server Error'
      : 'Request Error';
  }

  private getDetails(
    exceptionResponse: string | HttpExceptionBody,
  ): string[] | undefined {
    if (
      typeof exceptionResponse !== 'string' &&
      Array.isArray(exceptionResponse.message)
    ) {
      return exceptionResponse.message;
    }

    return undefined;
  }
}
