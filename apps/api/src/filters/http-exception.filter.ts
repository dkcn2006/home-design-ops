import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import type { Response } from "express";

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
  path: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message: this.extractMessage(exceptionResponse),
      timestamp: new Date().toISOString(),
      path: request.url
    };

    if (status === HttpStatus.BAD_REQUEST && typeof exceptionResponse === "object") {
      const validationErrors = this.extractValidationErrors(exceptionResponse);
      if (validationErrors.length > 0) {
        errorResponse.errors = validationErrors;
      }
    }

    response.status(status).json(errorResponse);
  }

  private extractMessage(response: string | object): string {
    if (typeof response === "string") return response;
    if (typeof response === "object" && response !== null && "message" in response) {
      const msg = (response as Record<string, unknown>).message;
      if (typeof msg === "string") return msg;
      if (Array.isArray(msg)) return msg.join("; ");
    }
    return "An error occurred";
  }

  private extractValidationErrors(response: object): Array<{ field: string; message: string }> {
    if (typeof response !== "object" || response === null) return [];
    const obj = response as Record<string, unknown>;
    if (!Array.isArray(obj.message)) return [];

    return obj.message
      .filter((item): item is string => typeof item === "string")
      .map((msg) => {
        const match = msg.match(/^property (.+) should not exist$/i);
        if (match) {
          return { field: match[1], message: msg };
        }
        const fieldMatch = msg.match(/^(.+) (.+)$/);
        return {
          field: fieldMatch ? fieldMatch[1] : "general",
          message: msg
        };
      });
  }
}
