---
name: git-diff-commit-writer
description: Generate repository-aware commit messages from local git changes. Default to Simplified Chinese Conventional Commits, keeping only the type and optional scope in English unless the user explicitly requests another language. When the user explicitly asks to commit, reuse the same message-generation logic and execute git commit conservatively against the requested scope.
---

# Git Diff Commit Writer

Generate clear, specific commit messages from the local repository state.

Default language for all outputs is Simplified Chinese unless the user explicitly asks for another language.

## When to use

Use this skill when the user asks things like:

- “根据当前 git diff 生成 commit message”
- “帮我写一个详细一点的 commit”
- “根据 staged changes 总结提交内容”
- “按 conventional commits 风格写提交说明”
- “帮我看看这次改动适合怎么 commit”
- “帮我生成中文 commit”
- “帮我写提交说明”
- “根据当前改动写提交信息”
- “给我一个 git commit message”

Use it for both:

- unstaged or mixed working tree changes
- staged changes intended for the next commit

This skill supports two modes:

- message mode: only generate commit content
- commit mode: generate commit content first, then execute `git commit`

## When not to use

Do not use this skill when the user wants:

- a PR description
- a release note or changelog for multiple commits
- a code review
- a design doc
- a summary of repository history unrelated to current diff

## Primary goal

Given the current local git changes, produce a commit message that is:

1. faithful to the actual diff
2. specific about what changed
3. explicit about why the change matters when the diff makes that inferable
4. properly scoped
5. conservative: never invent behavior or motivations not supported by the diff

If the user explicitly asks to create a commit, the secondary goal is:

6. execute the commit safely using the generated Chinese Conventional Commit message
7. avoid changing commit scope implicitly

## Language policy

Unless the user explicitly asks for English or another language:

- Write the commit message in Simplified Chinese.
- Keep the Conventional Commit type and optional scope in English.
- Write the subject description, body bullets, alternatives, and ambiguity note in Chinese.
- Prefer concise, natural Chinese phrasing over literal translation from English.

Recommended default subject format:

- `<type>(<scope>): 中文摘要`
- or `<type>: 中文摘要`

Examples:

- `feat(api): 新增线索录入与阶段更新接口`
- `fix(web): 修正客户门户状态映射`
- `refactor(shared): 简化报价相关类型定义`

## Default output format

Unless the user specifies another format, output:

1. 一个推荐的 subject line
2. 一个按改动关注点分组的中文 body
3. 1 到 3 个可选的中文 subject line
4. 如果意图不清晰，补一条简短的中文不确定性说明

Use this exact response shape by default:

```text
推荐 subject:
<type>(<scope>): 中文摘要

推荐 body:
- ...
- ...

备选 subject:
- ...
- ...

说明:
- 本次提交基于 staged changes
```

If the user only asks for “一个 commit message” and does not ask for details, still return:

```text
<type>(<scope>): 中文摘要
```

Only expand to body, alternatives, and notes when that adds clear value.

In commit mode, do not stop at message generation. Use the generated content to run `git commit`, then report the final commit result.

Default style:

- Prefer Conventional Commits when the diff supports a clear type.
- Keep `<type>` and optional `<scope>` in English.
- Write `<subject>` in Simplified Chinese by default.
- Allowed common types:
  - `feat`
  - `fix`
  - `refactor`
  - `perf`
  - `test`
  - `docs`
  - `build`
  - `ci`
  - `chore`
  - `style`

## Required workflow

Follow this workflow exactly.

### Step 1: Inspect repo state

First inspect the repository state.

Run:

```bash
bash .agents/skills/git-diff-commit-writer/scripts/collect_git_diff.sh
```

If the script is unavailable for some reason, run these commands manually:

```bash
git status --short
git diff --cached --stat
git diff --cached --minimal
git diff --stat
git diff --minimal
```

### Step 2: Decide the commit scope

Determine whether the requested commit message should describe:

- only staged changes
- all current worktree changes
- a subset explicitly mentioned by the user

If the user is ambiguous, prefer describing the exact diff you inspected and say what that scope was.

If the user explicitly asks to commit, determine scope with these rules:

- If the user says `staged`, `已暂存`, or `提交当前暂存内容`, commit only staged changes.
- If the user clearly asks to commit all current changes, stage tracked and untracked files intentionally before commit.
- If the user asks to commit but does not specify scope and staged changes already exist, prefer staged changes.
- If the user asks to commit but only unstaged changes exist, state that the commit will include current worktree changes and stage them explicitly before commit.
- If the tree contains clearly mixed unrelated changes, warn and avoid auto-committing everything unless the user explicitly insists.

### Step 3: Infer the message conservatively

Base the message only on what the diff shows.

- Do not invent intent that is not supported by filenames, code changes, or nearby documentation.
- Do not claim bug fixes, performance wins, or refactors unless the diff clearly supports that framing.
- If multiple unrelated changes exist, either:
  - recommend splitting commits, or
  - write a broader message that honestly covers the mixed scope

### Step 4: Produce the final commit message

Return:

1. 一个推荐的中文 subject line
2. 一个按改动关注点组织的中文 body
3. 1 到 3 个中文备选 subject line
4. 如有必要，补一条中文不确定性说明

Default decision rules:

- If the user asks for a single commit message, return only one Chinese Conventional Commit subject unless the diff is clearly mixed.
- If the user asks for “详细一点” or “完整提交说明”, include a Chinese body.
- If the change scope is mixed, first say that it is better split into multiple commits, then provide the safest combined Chinese subject.
- If only staged changes exist, default to staged scope.
- If both staged and unstaged changes exist, explicitly state which one the output covers.

### Step 5: Execute the commit when requested

Only do this step if the user explicitly asks to commit, for example:

- “直接帮我提交”
- “用这个逻辑直接 commit”
- “生成后直接提交”
- “帮我提交当前 staged changes”

Execution rules:

- Reuse the message generated in Step 4. Do not invent a second version during commit.
- Prefer `git commit -m "<subject>"` when only a subject is needed.
- Prefer:

```bash
git commit -m "<subject>" -m "<body line 1>
<body line 2>"
```

when a body adds value.
- If the chosen scope includes unstaged files, stage them intentionally first with the narrowest safe command.
- Do not run `git add -A` unless the user explicitly wants all changes committed.
- Do not amend an existing commit unless the user explicitly asks.
- After committing, report the created commit subject and resulting commit hash.
- If there is nothing to commit, say so clearly instead of fabricating a commit.

## Writing guidance

- Keep the subject line under about 72 characters when practical.
- Use imperative mood.
- Prefer concrete nouns over vague wording like “update stuff”.
- Mention affected subsystems when the scope is inferable.
- Keep the body concise but specific.
- 中文摘要优先使用“新增 / 修复 / 调整 / 重构 / 补充 / 优化 / 统一 / 拆分”等动作词开头。
- 避免中英混杂的生硬表达，例如“update 线索 form”。
- 如果用户没有要求详细 body，默认也应先给出中文 subject，并提供可选 body。
- 不要把解释性说明混入 commit subject；原因或范围放到 body 里。
- 在 commit mode 下，提交信息正文要与最终执行的 `git commit` 内容完全一致。
- 若 body 过长，优先压缩成 2 到 4 条中文要点，避免生成冗长提交说明。

## Examples

Example subject lines:

- `feat(api): 新增项目变更单接口`
- `fix(web): 修正客户门户状态映射`
- `refactor(shared): 简化报价类型定义`
- `docs: 补充本地开发说明`

## Notes

- If the repo contains both staged and unstaged changes, explicitly say which one your recommendation covers.
- If the diff looks too large or mixed, recommend separate commits before drafting a final message.
- If the user says “中文 commit”, treat that as a strong preference and do not fall back to English examples or English body text.
- Treat “commit message”, “提交信息”, “提交说明”, and “git commit” as equivalent triggers for this skill.
- Do not output English-only commit subjects unless the user explicitly asks for English.
- Treat “直接提交”, “帮我 commit”, “直接帮我提交”, and “生成后直接提交” as commit mode triggers.
- In commit mode, prefer the smallest safe commit scope and state that scope explicitly before execution when it is not obvious.
