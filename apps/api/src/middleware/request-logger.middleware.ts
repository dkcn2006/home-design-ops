import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const level = status >= 500 ? "error" : status >= 400 ? "warn" : "log";
      const message = `${method} ${originalUrl} ${status} - ${duration}ms - ${ip}`;

      if (level === "error") this.logger.error(message);
      else if (level === "warn") this.logger.warn(message);
      else this.logger.log(message);
    });

    next();
  }
}
