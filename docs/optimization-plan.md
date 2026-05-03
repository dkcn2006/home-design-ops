# 工程优化计划

更新时间：2026-05-03

本文基于当前仓库实现、文档、构建脚本和质量命令检查结果整理。目标不是把项目改成通用 CRM 或通用项目管理工具，而是在已有“家装运营工作台”方向上，让工程更稳定、更可验证，并更快支撑下一批业务闭环。

## 当前判断

### 已具备的基础

- 工程已经形成清晰 monorepo：`apps/web`、`apps/api`、`packages/shared` 分工明确。
- 前端已覆盖首页工作区、销售线索、项目档案、项目看板、我的任务、角色工作台和客户门户。
- API 已覆盖 demo 仓储上的客户、线索、项目、任务、确认记录和 AI 编排桩。
- `packages/shared` 已经承担前后端共享领域契约，降低了接口字段漂移风险。
- `npm run lint` 当前通过，`npm run build` 在允许联网拉取 Google Fonts 后通过。

### 主要风险

- 自动化测试仍是占位脚本，当前 `npm run test` 不能验证业务行为。
- `apps/api/prisma/schema.prisma` 与 `packages/shared/src/types.ts` 的领域模型差距较大，后续接 PostgreSQL 时容易出现迁移返工。
- 多处业务日期硬编码为 `2026-04-19`，会影响逾期、今日跟进、长期未跟进等运营指标。
- `DESIGN.md` 描述的是 Linear 深色设计系统，但当前 `apps/web/app/globals.css` 实际是温暖运营工作台风格，设计事实来源需要同步。
- API 目前主要依赖内存 demo 数据和宽松 body 类型，缺少 DTO 校验、错误格式、权限边界和持久化仓储边界。
- Web 的 Server Actions 和页面逻辑已经可用，但缺少错误态、空态、加载态、表单校验和移动端回归验证。

## 优化原则

- 优先稳定业务闭环，再做大规模技术替换。
- 优先围绕 `Lead -> Project -> ProjectTask -> Confirmation` 打磨核心路径。
- 优先补齐可验证性，包括单元测试、契约测试、构建稳定性和轻量 CI。
- 继续保留当前温暖、安静、运营可用的视觉语言，不引入冲突设计系统。
- 每一阶段都保持可运行、可演示、可回退。

## P0：工程基线与质量闸门

目标：让团队知道每次改动是否破坏了基础能力。

建议任务：

- 将 `test` 占位脚本替换为真实测试框架：
  - `packages/shared` 使用 `vitest` 覆盖 seed 聚合、枚举映射和核心计算。
  - `apps/api` 使用 Nest testing module 覆盖 repository 和 controller。
  - `apps/web` 先补 `vitest` 或 React Testing Library 的纯函数/组件测试，后续再加 e2e。
- 新增 `.github/workflows/ci.yml` 或等价 CI：
  - 安装依赖。
  - 执行 `npm run lint`。
  - 执行 `npm run test`。
  - 执行 `npm run build`。
- 解决构建对 Google Fonts 网络的强依赖：
  - 方案 A：保留 `next/font/google`，CI 明确允许网络。
  - 方案 B：改为本地字体资源，提升离线构建稳定性。
- 增加 `npm run typecheck` 别名，避免 `lint` 实际只做 `tsc --noEmit` 时语义不清。

验收标准：

- `npm run lint`、`npm run test`、`npm run build` 都能提供真实信号。
- CI 能在 pull request 或主分支推送时自动运行。
- 在无业务改动时，测试不依赖真实外部服务。

## P1：领域契约与数据模型对齐

目标：降低从 demo 内存仓储迁移到 PostgreSQL 的返工风险。

建议任务：

- 建立共享领域模型和 Prisma schema 的字段对照表，优先覆盖：
  - `Lead`
  - `User`
  - `WorkflowPhase`
  - `Space`
  - `ProjectTask`
  - `TaskLinkedEntity`
  - `ConfirmationRecord`
  - `Attachment`
- 扩展 `schema.prisma`，补齐当前 V1 已经使用但数据库尚未表达的对象。
- 将字符串状态逐步收敛为 Prisma enum 或受控字段，减少状态拼写错误。
- 为 demo seed 增加一致性检查：
  - 每个 `project.leadId` 必须存在。
  - 每个 `task.assigneeId` 必须存在。
  - 每个 `task.phaseId` 必须存在。
  - 每个 `confirmation.projectId` 必须存在。
- 定义仓储接口，例如 `ProjectRepository`、`LeadRepository`、`TaskRepository`，让内存实现和 Prisma 实现可以并存切换。

验收标准：

- Prisma schema 能完整表达当前核心 demo 业务。
- seed 一致性测试能捕获断链数据。
- API controller 不直接依赖具体内存数组。

## P2：日期、指标与运营语义治理

目标：让首页、线索页、任务页上的指标在真实日期下仍然可信。

建议任务：

- 新增统一日期工具，集中处理：
  - 今日日期。
  - 逾期判断。
  - 今日跟进判断。
  - 长期未跟进阈值。
  - 日期格式化。
- 去除 `DemoRepositoryService` 和 `LeadKanban` 中的 `2026-04-19` 硬编码。
- 为 demo 模式引入可配置 `DEMO_TODAY`，便于演示数据保持稳定，同时生产逻辑使用真实日期。
- 明确运营指标定义：
  - `todayFollowUpCount` 是否包含已赢单和已流失线索。
  - `overdueFollowUpCount` 是否排除今日。
  - `staleLeadCount` 阈值是 7 天、14 天还是按阶段配置。
  - `conversionRate` 分母是否排除流失线索。

验收标准：

- 修改系统日期或 `DEMO_TODAY` 后，相关指标变化可预测。
- 日期逻辑有单元测试覆盖。
- 前后端对“逾期”和“今日”的判断一致。

## P3：API 稳定性与安全边界

目标：让 API 从 demo 可用升级为可承接真实业务的服务层。

建议任务：

- 为写接口增加 DTO class 和 `ValidationPipe`：
  - `CreateLeadIntakeDto`
  - `UpdateLeadStageDto`
  - `UpdateTaskStatusDto`
  - `UpdateTaskAssigneeDto`
  - `UpdateConfirmationDto`
- 收紧 CORS 配置，不在默认生产配置中使用完全开放策略。
- 增加统一错误响应结构，便于 Web 展示表单错误。
- 增加请求日志和基础审计字段处理，尤其是确认、任务状态变更、负责人变更。
- 定义最小权限模型：
  - 销售可管理线索和跟进任务。
  - 设计/深化可更新设计相关任务。
  - 项目经理可更新施工和巡检相关任务。
  - 客户只能处理自己的确认记录。
- 为 AI 编排接口保留 deterministic mock，同时设计真实模型接入边界：
  - request schema
  - response schema
  - timeout
  - retry
  - fallback

验收标准：

- 无效 body 会返回清晰的 400 错误。
- 客户确认、任务状态变更有审计记录或预留审计字段。
- API 层可以在内存仓储和未来 Prisma 仓储之间切换。

## P4：前端体验补齐

目标：让已实现页面从“能看”升级为“团队日常可用”。

建议任务：

- 为核心页面补齐空态、错误态和加载态：
  - `/`
  - `/sales/leads`
  - `/tasks`
  - `/projects/[id]`
  - `/projects/[id]/board`
  - `/client/[id]`
- 为表单补齐前端校验和提交反馈：
  - 新建线索。
  - 更新线索阶段。
  - 客户确认。
  - 任务状态更新。
- 项目看板过滤控件从静态按钮升级为真实筛选：
  - 按负责人。
  - 按阶段。
  - 按优先级。
  - 按阻塞/待客户确认。
- 线索看板增加键盘可访问性：
  - `Enter` 或 `Space` 打开详情。
  - 可见焦点态。
  - 选择阶段后展示成功或失败反馈。
- 针对移动端检查：
  - 侧边栏导航。
  - 横向看板。
  - 表格在窄屏下的可读性。
  - 客户门户触控目标。

验收标准：

- 断开 API 或写入失败时，页面能给出清晰反馈。
- 关键表单不会静默失败。
- 移动端能完成线索查看、客户确认和任务查看。

## P5：设计事实来源更新

目标：让后续 UI polish 有统一依据。

建议任务：

- 更新 `DESIGN.md`，将当前实际视觉系统记录为主事实来源：
  - 温暖背景、卡片、线条、橄榄和棕色强调色。
  - 中文业务系统字体策略。
  - 运营工作台信息密度。
  - 看板、表格、任务卡、客户门户的组件规则。
- 保留 Linear 参考作为“交互和信息层级参考”，不要作为当前视觉令牌。
- 将常用视觉 token 从 `globals.css` 中整理成明确小节，避免页面级样式继续膨胀。
- 抽取复用组件样式：
  - page header
  - metric card
  - badge
  - table
  - empty state
  - inline error
  - action bar

验收标准：

- 新页面按 `DESIGN.md` 实现时，不会做成深色 Linear 风。
- 页面之间保持当前温暖运营语言。
- `globals.css` 的新增样式更容易归类和复用。

## P6：产品闭环深化

目标：把 MVP 最有价值的家装业务闭环做扎实。

建议任务：

- 完成客户确认闭环：
  - `waiting_client` 任务自动关联确认记录。
  - 客户门户展示待确认事项和历史确认。
  - 内部项目看板能看到确认阻塞原因。
- 完成角色工作台迁移：
  - 将旧 `WorkItem` 聚合逐步迁移到 `ProjectTask`。
  - 销售、设计、深化、项目经理看到各自真实任务。
- 强化版本、报价、变更控制：
  - 设计版本、施工图版本、报价、变更单之间建立清晰关联。
  - 报价与图纸版本不一致时提示风险。
  - 变更单需要客户确认后再影响项目状态。
- AI 从“建议文本”升级为“行动草稿”：
  - 根据需求生成任务草稿。
  - 根据阻塞任务生成项目风险摘要。
  - 根据巡检记录生成待办和责任人建议。

验收标准：

- 项目团队能从首页进入任务，再进入项目或客户确认对象。
- 客户确认会影响内部阻塞视图。
- AI 输出可以被转化为可执行任务，而不是只停留在文本建议。

## 建议执行顺序

### 第 1 周：质量和日期基线

- 替换占位测试脚本。
- 增加 seed 一致性测试。
- 引入日期工具和 `DEMO_TODAY`。
- 增加 CI。
- 处理离线构建或 CI 字体网络策略。

### 第 2 周：领域模型和 API 边界

- 完成 shared 类型与 Prisma schema 对照。
- 补齐 Prisma 核心模型。
- 抽象仓储接口。
- 增加 DTO 校验和统一错误响应。

### 第 3 周：前端核心体验

- 补齐核心页面错误态、空态、加载态。
- 线索和确认表单增加校验反馈。
- 项目看板筛选变成真实交互。
- 做一轮移动端和可访问性检查。

### 第 4 周：业务闭环和设计文档

- 完成客户确认与 `waiting_client` 任务联动。
- 角色工作台开始迁移到 `ProjectTask`。
- 更新 `DESIGN.md` 为当前温暖运营设计事实来源。
- 整理 `globals.css` 的组件样式分区。

## 当前验证记录

- `npm run lint`：通过。
- `npm run test`：通过，但目前只是占位输出，不能视为真实测试覆盖。
- `npm run build`：沙箱无网络时失败，原因是 `next/font/google` 无法访问 `fonts.googleapis.com`；允许联网后通过。

