import { RolesGuard, SalesGuard, DesignerGuard, ProjectManagerGuard, InternalGuard } from "./roles.guard";
import { ForbiddenException, ExecutionContext } from "@nestjs/common";

describe("RolesGuard", () => {
  const createContext = (roleHeader: string | undefined) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { "x-user-role": roleHeader }
        })
      })
    }) as ExecutionContext;

  it("should allow admin to access any internal resource", () => {
    const guard = new RolesGuard(["sales", "admin"]);
    expect(guard.canActivate(createContext("admin"))).toBe(true);
  });

  it("should allow sales to access sales resource", () => {
    const guard = new RolesGuard(["sales", "admin"]);
    expect(guard.canActivate(createContext("sales"))).toBe(true);
  });

  it("should deny client from accessing internal resource", () => {
    const guard = new RolesGuard(["sales", "designer", "admin"]);
    expect(() => guard.canActivate(createContext("client"))).toThrow(ForbiddenException);
  });

  it("should deny designer from accessing sales-only resource", () => {
    const guard = new RolesGuard(["sales", "admin"]);
    expect(() => guard.canActivate(createContext("designer"))).toThrow(ForbiddenException);
  });

  it("SalesGuard should allow sales and admin", () => {
    expect(SalesGuard.canActivate(createContext("sales"))).toBe(true);
    expect(SalesGuard.canActivate(createContext("admin"))).toBe(true);
    expect(() => SalesGuard.canActivate(createContext("client"))).toThrow(ForbiddenException);
  });

  it("DesignerGuard should allow designer and admin", () => {
    expect(DesignerGuard.canActivate(createContext("designer"))).toBe(true);
    expect(DesignerGuard.canActivate(createContext("admin"))).toBe(true);
    expect(() => DesignerGuard.canActivate(createContext("sales"))).toThrow(ForbiddenException);
  });

  it("ProjectManagerGuard should allow project_manager and admin", () => {
    expect(ProjectManagerGuard.canActivate(createContext("project_manager"))).toBe(true);
    expect(ProjectManagerGuard.canActivate(createContext("admin"))).toBe(true);
    expect(() => ProjectManagerGuard.canActivate(createContext("designer"))).toThrow(ForbiddenException);
  });

  it("InternalGuard should allow all internal roles", () => {
    expect(InternalGuard.canActivate(createContext("sales"))).toBe(true);
    expect(InternalGuard.canActivate(createContext("designer"))).toBe(true);
    expect(InternalGuard.canActivate(createContext("detailer"))).toBe(true);
    expect(InternalGuard.canActivate(createContext("project_manager"))).toBe(true);
    expect(InternalGuard.canActivate(createContext("admin"))).toBe(true);
    expect(() => InternalGuard.canActivate(createContext("client"))).toThrow(ForbiddenException);
  });

  it("should default to client when no header is present", () => {
    const guard = new RolesGuard(["sales", "admin"]);
    expect(() => guard.canActivate(createContext(undefined))).toThrow(ForbiddenException);
  });
});
