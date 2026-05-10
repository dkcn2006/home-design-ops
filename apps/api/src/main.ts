import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET"];

function validateEnv() {
  const isDev = process.env.NODE_ENV === "development";
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    if (isDev) {
      Logger.warn(
        `Missing environment variables in dev (using defaults): ${missing.join(", ")}`,
        "Bootstrap"
      );
    } else {
      Logger.error(
        `Missing required environment variables: ${missing.join(", ")}`,
        "Bootstrap"
      );
      process.exit(1);
    }
  }
}

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "OPTIONS"]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix("api");
  const port = process.env.PORT ? Number(process.env.PORT) : 4010;
  const host = process.env.HOST || "127.0.0.1";
  await app.listen(port, host);

  Logger.log(`API running on http://${host}:${port}/api`, "Bootstrap");
}

bootstrap();
