import { Global, Module } from "@nestjs/common";
import { DemoRepositoryService } from "../services/demo-repository.service";
import {
  CUSTOMER_REPOSITORY,
  DASHBOARD_REPOSITORY,
  LEAD_REPOSITORY,
  PROJECT_REPOSITORY,
  TASK_REPOSITORY
} from "../repositories";

@Global()
@Module({
  providers: [
    DemoRepositoryService,
    { provide: CUSTOMER_REPOSITORY, useExisting: DemoRepositoryService },
    { provide: LEAD_REPOSITORY, useExisting: DemoRepositoryService },
    { provide: PROJECT_REPOSITORY, useExisting: DemoRepositoryService },
    { provide: TASK_REPOSITORY, useExisting: DemoRepositoryService },
    { provide: DASHBOARD_REPOSITORY, useExisting: DemoRepositoryService }
  ],
  exports: [
    CUSTOMER_REPOSITORY,
    LEAD_REPOSITORY,
    PROJECT_REPOSITORY,
    TASK_REPOSITORY,
    DASHBOARD_REPOSITORY
  ]
})
export class RepositoryModule {}
