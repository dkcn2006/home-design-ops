import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
}

bootstrap();
