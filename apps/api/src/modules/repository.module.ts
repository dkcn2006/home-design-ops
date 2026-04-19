import { Global, Module } from "@nestjs/common";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Global()
@Module({
  providers: [DemoRepositoryService],
  exports: [DemoRepositoryService]
})
export class RepositoryModule {}

