# Implementation Overview

This repository now includes a working MVP-oriented monorepo structure for `home-design-ops`.

## Workspace layout

- `apps/web`
  - Next.js App Router application
  - role-based dashboards and project archive views
- `apps/api`
  - NestJS REST API
  - in-memory demo repository plus Prisma schema for the long-term PostgreSQL model
- `packages/shared`
  - shared domain types, enums, and demo seed data

## MVP scope implemented

- customer and lead tracking
- project archive overview
- requirement sheets
- design / rendering / construction drawing versions
- quotations and change orders
- milestones and inspections
- confirmation records and attachments
- AI suggestion endpoints for:
  - requirement extraction
  - SU layout assistance
  - rendering guidance
  - construction drawing review
  - inspection report drafting

## Technical notes

- The API currently uses shared demo data through a singleton repository so the product can be explored without a live database.
- Prisma schema is included to define the PostgreSQL target model and reduce future migration churn.
- AI behavior is implemented as structured orchestration stubs with deterministic outputs, so the UI and API contracts are ready before a model provider is connected.

