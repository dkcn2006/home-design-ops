import { Controller, Get, Module } from "@nestjs/common";

@Controller("auth")
class AuthController {
  @Get("session")
  getSession() {
    return {
      user: {
        id: "user-1",
        name: "Demo Operator",
        role: "admin"
      },
      availableRoles: ["sales", "designer", "detailer", "project_manager", "client", "admin"]
    };
  }
}

@Module({
  controllers: [AuthController]
})
export class AuthModule {}

