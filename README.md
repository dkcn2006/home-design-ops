# home-design-ops

An MVP-oriented monorepo for a home renovation operations system that connects sales, design, detailing, delivery, client confirmations, and workflow-native AI assistance.

[中文说明 / Chinese Version](./README.zh-CN.md)

## What is implemented

This repository now includes a concrete implementation foundation for the V1 plan:

- `apps/web`
  - Next.js App Router frontend
  - role dashboards for sales, designer, and project manager
  - project archive center
  - client portal view
- `apps/api`
  - NestJS REST API
  - resource-oriented endpoints for customers, leads, projects, requirements, design outputs, quotations, changes, milestones, inspections, confirmations, attachments, and AI helpers
- `packages/shared`
  - shared domain models
  - demo seed data
  - AI response contracts
- `docs/implementation-overview.md`
  - a concise architecture and implementation summary

## Implemented MVP scope

- customer and lead tracking
- project archive as the core data hub
- SU design versions, rendering versions, and construction drawing versions
- quotations and change orders
- milestones and inspection records
- confirmation records and attachment metadata
- AI orchestration stubs for:
  - requirement extraction
  - SU layout assistance
  - rendering guidance
  - construction drawing review
  - inspection digest generation

## Tech stack

- Frontend: Next.js + React + TypeScript
- API: NestJS + TypeScript
- Data model target: PostgreSQL via Prisma schema
- Shared contracts: workspace package
- File storage target: object storage metadata model

## Getting started

### Requirements

- Node.js `>= 20.0.0`
- npm `>= 8`

The current repo includes `.nvmrc` with the recommended version:

```bash
nvm use
```

### Install

```bash
npm install
```

### Run

```bash
npm run dev:api
npm run dev:web
```

### Build

```bash
npm run build
```

## Current implementation note

The API and frontend are wired around shared demo data so the product flow can be explored immediately. The PostgreSQL target model is already defined through Prisma schema, which reduces future migration churn when replacing the in-memory repository with persistent storage.

## Why this project exists

This project is personal.

My younger brother works in the home renovation design industry, and I work in IT. I want to use AI in a way that helps real renovation teams reduce repeated revisions, information gaps, and preventable rework, and hopefully help his team operate more efficiently and improve income.

