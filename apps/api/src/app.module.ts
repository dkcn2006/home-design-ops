import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AiModule } from "./modules/ai.module";
import { AuthModule } from "./modules/auth.module";
import { AttachmentsModule } from "./modules/attachments.module";
import { ConfirmationsModule } from "./modules/confirmations.module";
import { CustomersModule } from "./modules/customers.module";
import { LeadsModule } from "./modules/leads.module";
import { ProjectsModule } from "./modules/projects.module";
import { RepositoryModule } from "./modules/repository.module";
import { TasksModule } from "./modules/tasks.module";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";

@Module({
  imports: [
    RepositoryModule,
    AuthModule,
    CustomersModule,
    LeadsModule,
    ProjectsModule,
    TasksModule,
    ConfirmationsModule,
    AttachmentsModule,
    AiModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
