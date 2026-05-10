import { Global, Module } from "@nestjs/common";
import { DemoRepositoryService } from "../services/demo-repository.service";
import { PrismaRepositoryService } from "../services/prisma-repository.service";
import {
  CUSTOMER_REPOSITORY,
  DASHBOARD_REPOSITORY,
  LEAD_REPOSITORY,
  PROJECT_REPOSITORY,
  TASK_REPOSITORY
} from "../repositories";

const usePrisma = process.env.REPOSITORY_IMPL === "prisma";

const repositoryProvider = usePrisma ? PrismaRepositoryService : DemoRepositoryService;

@Global()
@Module({
  providers: [
    repositoryProvider,
    { provide: CUSTOMER_REPOSITORY, useExisting: repositoryProvider },
    { provide: LEAD_REPOSITORY, useExisting: repositoryProvider },
    { provide: PROJECT_REPOSITORY, useExisting: repositoryProvider },
    { provide: TASK_REPOSITORY, useExisting: repositoryProvider },
    { provide: DASHBOARD_REPOSITORY, useExisting: repositoryProvider }
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
