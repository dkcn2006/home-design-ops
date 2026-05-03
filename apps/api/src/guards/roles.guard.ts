import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import type { UserRole } from "@home-design-ops/shared";

const ROLE_HEADER = "x-user-role";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: UserRole[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const role = (request.headers[ROLE_HEADER] as UserRole | undefined) || "client";

    if (!this.allowedRoles.includes(role)) {
      throw new ForbiddenException(`角色 ${role} 无权访问此资源`);
    }

    return true;
  }
}

export const SalesGuard = new RolesGuard(["sales", "admin"]);
export const DesignerGuard = new RolesGuard(["designer", "admin"]);
export const ProjectManagerGuard = new RolesGuard(["project_manager", "admin"]);
export const InternalGuard = new RolesGuard([
  "sales", "designer", "detailer", "project_manager", "admin"
]);
