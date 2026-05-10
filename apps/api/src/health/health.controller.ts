import { Controller, Get } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Controller("health")
export class HealthController {
  private readonly prisma = new PrismaClient();

  @Get()
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "home-design-ops-api"
    };
  }

  @Get("live")
  liveness() {
    return { status: "alive" };
  }

  @Get("ready")
  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ready",
        checks: { database: "up" }
      };
    } catch {
      return {
        status: "not_ready",
        checks: { database: "down" }
      };
    }
  }
}
