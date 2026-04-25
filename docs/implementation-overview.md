# 实现概览

这个仓库已经包含一套面向 MVP 的 `home-design-ops` monorepo 工程结构。

## 工作区结构

- `apps/web`
  - Next.js App Router 应用
  - 基于角色的工作台和项目档案视图
- `apps/api`
  - NestJS REST API
  - 当前使用内存 demo 仓储，同时保留面向长期 PostgreSQL 模型的 Prisma schema
- `packages/shared`
  - 共享领域类型、枚举和 demo seed 数据

## 已实现的 MVP 范围

- 客户与线索管理
- 项目档案概览
- 需求单
- 设计版本、效果图版本和施工图版本
- 报价与变更单
- 里程碑与巡检
- 确认记录和附件
- AI 建议接口：
  - 需求提取
  - SU 布局辅助
  - 效果图建议
  - 施工图校核
  - 巡检报告草稿

## 技术说明

- API 当前通过单例仓储使用共享 demo 数据，因此无需真实数据库也能体验产品流程。
- Prisma schema 已经包含 PostgreSQL 目标模型，用于降低后续迁移成本。
- AI 行为目前是结构化编排桩，返回确定性结果，便于在接入真实模型服务前先稳定 UI 和 API 契约。
