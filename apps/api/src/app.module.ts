import { Module } from "@nestjs/common";
import { AiModule } from "./modules/ai.module";
import { AuthModule } from "./modules/auth.module";
import { AttachmentsModule } from "./modules/attachments.module";
import { ConfirmationsModule } from "./modules/confirmations.module";
import { CustomersModule } from "./modules/customers.module";
import { LeadsModule } from "./modules/leads.module";
import { ProjectsModule } from "./modules/projects.module";
import { RepositoryModule } from "./modules/repository.module";

@Module({
  imports: [
    RepositoryModule,
    AuthModule,
    CustomersModule,
    LeadsModule,
    ProjectsModule,
    ConfirmationsModule,
    AttachmentsModule,
    AiModule
  ]
})
export class AppModule {}

