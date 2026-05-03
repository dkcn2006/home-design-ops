import type { Customer } from "@home-design-ops/shared";

export interface CustomerRepository {
  getCustomers(): Customer[];
}
