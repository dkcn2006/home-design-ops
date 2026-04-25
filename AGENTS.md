# 项目指令

## 计划和提案语言

在本仓库中编写任何产品计划、技术计划、roadmap、实现提案、架构提案、设计提案或决策备忘录时：

- 主体内容使用简体中文
- code identifiers、API paths、file paths、type names、command names 和 proper nouns 在更清晰时保留原文
- 如果用户明确要求英文版本，则该请求只提供英文
- 优先使用具体、可执行的表述，避免抽象策略话术

## 设计事实来源

在本仓库中处理任何前端设计、UI polish、布局调整、组件样式或页面重设计时：

- 先阅读 `DESIGN.md`
- 将 `DESIGN.md` 作为设计事实来源
- 保留当前温暖的运营设计语言
- 除非用户明确要求重设计，否则不要引入冲突的视觉系统

## 前端实现偏好

- 优先扩展 `apps/web/app/globals.css` 中的现有样式
- 让页面之间保持视觉关联
- 优先保证清晰度、层级和运营可用性
- 确保桌面端和移动端布局都保持可用

## Codex 提交规范

当 Codex 在本仓库中自动创建 git commit 时，commit message 末尾必须追加：

```text
Co-authored-by: Codex <codex@openai.com>
```

该规则只约束 Codex 自动提交，不要求用户手动提交时添加该署名。
