# 实现进展记录

更新时间：2026-04-25

本文记录当前工作区尚未提交的实现进展，用于对齐 [子需求拆解](./requirements-breakdown.md) 和 [Roadmap](./roadmap.md)。当前进展主要覆盖 `M1`、`M2` 和 `M3` 的第一批可运行切片，尚未代表完整路线图全部落地。

## 当前实现范围

### M1：领域模型收敛

已完成：

- 升级 `Lead` 共享类型，补充来源、阶段、意向等级、负责人、预算区间、房屋信息、需求摘要、下一次跟进时间、最近跟进摘要、流失原因和关联项目等字段。
- 新增 `User`、`WorkflowPhase`、`ProjectTask`、`TaskLinkedEntity` 等共享类型。
- 新增任务状态、任务优先级、阶段分类、线索来源、线索意向等级等枚举。
- 扩展 demo seed 数据，包含多来源线索、多阶段线索、demo 用户、项目阶段、项目空间和项目任务。
- 保持现有首页、项目档案、客户门户和角色工作台的基础兼容。

主要涉及文件：

- `packages/shared/src/types.ts`
- `packages/shared/src/seed.ts`

### M2：线索转化工作台

已完成：

- 新增销售线索读取接口：`GET /sales/leads`。
- 新增线索摘要接口：`GET /sales/leads/summary`。
- 销售线索页升级为新阶段 pipeline，覆盖 `new`、`contacted`、`measured`、`proposal`、`quoted`、`negotiating`、`won`、`lost`。
- 增加今日需跟进、高意向机会、长期未跟进视图。
- 增加基础转化指标，包括线索总数、转化率、今日跟进数和高意向数。
- 新建线索时使用共享 `LeadSource`，并补齐 V1 所需默认字段。

主要涉及文件：

- `apps/api/src/modules/leads.module.ts`
- `apps/api/src/services/demo-repository.service.ts`
- `apps/web/app/sales/leads/page.tsx`
- `apps/web/lib/data.ts`
- `apps/web/lib/actions.ts`

### M3：项目任务 API

已完成：

- 新增项目任务列表接口：`GET /projects/:id/tasks`。
- 新增项目任务看板聚合接口：`GET /projects/:id/task-board`。
- 新增我的任务接口：`GET /tasks/my?assigneeId=...`。
- 新增任务状态更新接口：`PATCH /tasks/:id/status`。
- 新增任务负责人更新接口：`PATCH /tasks/:id/assignee`。
- 聚合项目任务摘要，包括总任务数、阻塞数、待客户确认数、逾期数和阻塞空间数。
- 看板数据按空间、阶段和任务组织，支持无空间任务落到“全项目”虚拟分组。

主要涉及文件：

- `apps/api/src/modules/projects.module.ts`
- `apps/api/src/modules/tasks.module.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/services/demo-repository.service.ts`

### M4：项目看板体验

已完成：

- 新增项目看板路由 `/projects/[id]/board`，消费 `GET /projects/:id/task-board`。
- 按 `Space` 分组，空间内按 `WorkflowPhase` 展示任务。
- 任务卡片展示标题、状态、优先级、负责人、截止日期、关联实体摘要和阻塞原因。
- 看板顶部展示总任务数、阻塞数、待客户确认数、逾期数和阻塞空间数。
- 在项目档案页增加“查看项目看板”入口，看板页提供“返回项目档案”入口。
- 视觉风格遵循 `DESIGN.md` 现有设计令牌。

主要涉及文件：

- `apps/web/app/projects/[id]/board/page.tsx`
- `apps/web/app/projects/[id]/page.tsx`
- `apps/web/app/globals.css`

### M5：我的工作（第一批）

已完成：

- 新增个人任务页 `/tasks`，消费 `GET /tasks/my?assigneeId=...`。
- 按截止日期升序展示个人跨项目任务，区分待处理和已完成。
- 任务列表展示状态、优先级、空间、阶段、关联实体和阻塞原因。
- 侧边栏导航增加“我的任务”入口。
- 支持通过 URL 参数切换 demo 用户视角。

主要涉及文件：

- `apps/web/app/tasks/page.tsx`
- `apps/web/components/layout.tsx`
- `apps/web/lib/data.ts`

## 已验证情况

已完成：

- `npm run build` 已通过，包含共享包、API 和 Web 构建。

已验证：

- `npm run build` 已通过，包含共享包、API 和 Web 构建。
- `npm run lint` 已通过，三个 workspace 均无类型错误。

## 尚未完成

下一步建议继续按路线图推进：

- `M5`：将角色工作台逐步从旧 `WorkItem` 聚合迁移到 `ProjectTask` 聚合。
- `M5`：升级销售工作台，突出今日需跟进线索、高意向机会、待客户确认事项。
- `M5`：升级设计工作台，突出设计输出、客户反馈、设计变更任务。
- `M5`：升级项目经理工作台，突出施工节点、巡检问题、阻塞风险。
- `M6`：在客户门户和内部视图中强化 `waiting_client` 与确认记录的关联展示。
- `M6`：客户门户展示待确认事项、确认对象、说明和备注入口。
- `M8`：将 demo 数据迁移到持久化模型前，需要先稳定 Prisma schema。

## 提交前注意事项

- 本轮实现还未提交。
- 若由 Codex 提交 commit，提交信息需要包含：

```text
Co-authored-by: Codex <codex@openai.com>
```

