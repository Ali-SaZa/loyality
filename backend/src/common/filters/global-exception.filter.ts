import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { PERSIAN_ERROR_MESSAGES } from "../errors/persian-error-messages";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;
    let details: any;

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;

      if (typeof response === "string") {
        message = response;
        error = this.getErrorType(status);
      } else {
        message = response.message || exception.message;
        error = response.error || this.getErrorType(status);
        details = response.details;
      }
    } else if (exception instanceof MongooseError) {
      // Handle MongoDB specific errors
      status = this.handleMongoError(exception);
      message = this.getMongoErrorMessage(exception);
      error = "Database Error";
      details = {
        code: (exception as any).code,
        codeName: (exception as any).codeName,
      };
    } else if (exception instanceof Error) {
      // Handle generic JavaScript errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = PERSIAN_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      error = "Internal Server Error";
      details = {
        name: exception.name,
        stack:
          process.env.NODE_ENV === "development" ? exception.stack : undefined,
      };
    } else {
      // Handle unknown errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = PERSIAN_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      error = "Unknown Error";
    }

    // Log the error
    this.logger.error(
      `Exception occurred: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      {
        path: request.url,
        method: request.method,
        status,
        timestamp: new Date().toISOString(),
        userAgent: request.get("User-Agent"),
        ip: request.ip,
      },
    );

    // Create error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      ...(details && { details }),
    };

    // Send response
    response.status(status).json(errorResponse);
  }

  private getErrorType(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "درخواست نامعتبر"; // translated to Persian
      case HttpStatus.UNAUTHORIZED:
        return "دسترسی غیرمجاز"; // translated to Persian
      case HttpStatus.FORBIDDEN:
        return "دسترسی ممنوع"; // translated to Persian
      case HttpStatus.NOT_FOUND:
        return "یافت نشد"; // translated to Persian
      case HttpStatus.CONFLICT:
        return "تضاد"; // translated to Persian
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return "خطای اعتبارسنجی"; // translated to Persian
      case HttpStatus.TOO_MANY_REQUESTS:
        return "تعداد درخواست بیش از حد"; // translated to Persian
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return "خطای داخلی سرور"; // translated to Persian
      case HttpStatus.SERVICE_UNAVAILABLE:
        return "سرویس در دسترس نیست"; // translated to Persian
      default:
        return "خطا"; // translated to Persian
    }
  }

  private handleMongoError(error: MongooseError): number {
    const mongoError = error as any;
    switch (mongoError.code) {
      case 11000: // Duplicate key error
        return HttpStatus.CONFLICT;
      case 121: // Document validation failed
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getMongoErrorMessage(error: MongooseError): string {
    const mongoError = error as any;
    switch (mongoError.code) {
      case 11000:
        const field = Object.keys(mongoError.keyPattern || {})[0];
        return `${field} already exists`;
      case 121:
        return PERSIAN_ERROR_MESSAGES.VALIDATION_FAILED;
      default:
        return PERSIAN_ERROR_MESSAGES.DATABASE_OPERATION_FAILED;
    }
  }
}
