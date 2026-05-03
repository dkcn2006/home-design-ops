# 设计系统：家装运营工作台

> 本文档是 `home-design-ops` 前端的事实设计来源。
>
> 历史参考：`Linear` 深色系统作为交互和信息层级的参考，但不是当前视觉令牌。当前系统为**温暖、安静、运营可用的中文业务工作台**。

---

## 1. 视觉主题与氛围

温暖、安静、有纸张质感的运营工作台。背景如同在日光下摊开的米色画纸，信息通过棕色和橄榄绿的 subtle 层级来组织，而非高对比度色块。中文排版优先保证可读性和信息密度，不追求装饰性字体效果。

**核心特征：**
- 温暖原生模式：`#f4f0e8` 页面背景，`#fffcf7` 卡片表面，`#f0ebe2` 侧边栏
- 中文业务字体栈：`PingFang SC` / `Noto Sans SC` / `Microsoft YaHei` 为主，`Noto Serif SC` 为标题衬线
- 棕色强调色：`#7a4e2e`（主强调）/ `#5c3a21`（悬停）/ `#f5ede4`（浅色背景）—— 温暖而克制
- 橄榄绿辅助：`#4a5748`（状态/标签）/ `#e8ece6`（浅色背景）
- 全局使用低对比度实色边框：`#e0d8cc`（标准）/ `#eae5dc`（微妙）
- 阴影系统极轻：`0 4px 16px rgba(28,25,23,0.06)`，避免悬浮感过强
- 圆角统一：`10px`（卡片/面板）/ `6px`（按钮/输入框/标签）

---

## 2. 色彩调色板与角色

### 背景表面
| Token | 色值 | 用途 |
|-------|------|------|
| `--bg` | `#f4f0e8` | 页面主背景，温暖米色 |
| `--bg-warm` | `#ede8dd` | 略深背景，用于区分区块 |
| `--card` | `#fffcf7` | 卡片、面板背景，接近纯白但带暖调 |
| `--card-elevated` | `#ffffff` | 抬升表面，下拉菜单、弹层 |
| `--sidebar-bg` | `#f0ebe2` | 侧边栏背景 |
| `--panel-tint` | `#faf7f2` | 极浅的 panel 着色 |
| `--hover` | `#ebe5da` | 悬停状态背景 |

### 文字
| Token | 色值 | 用途 |
|-------|------|------|
| `--ink` | `#1c1917` | 主文字，近黑带暖 |
| `--ink-soft` | `#3e3a36` | 次要标题、强调文字 |
| `--muted` | `#7c756b` | 正文描述、标签 |
| `--muted-light` | `#a39b8f` | 占位符、元数据、弱化内容 |

### 品牌与强调色
| Token | 色值 | 用途 |
|-------|------|------|
| `--accent` | `#7a4e2e` | 主强调——CTA、激活状态、链接 |
| `--accent-hover` | `#5c3a21` | 悬停/按下状态 |
| `--accent-soft` | `#f5ede4` | 浅色强调背景 |
| `--accent-muted` | `#e8ddd1` | 更浅的强调背景，badge、标签 |

### 辅助色
| Token | 色值 | 用途 |
|-------|------|------|
| `--olive` | `#4a5748` | 橄榄绿——成功状态、完成标签 |
| `--olive-soft` | `#e8ece6` | 橄榄绿浅色背景 |

### 状态色
| Token | 色值 | 用途 |
|-------|------|------|
| 成功 | `#4a5748` / `#ecfdf5` | 橄榄绿为主，绿色为辅 |
| 警告 | `#7a4e2e` / `#f5ede4` | 棕色系，避免刺眼红色 |
| 错误 | `#991b1b` / `#fef2f2` | 仅在真正需要时使用 |
| 阻塞 | `#b45309` / `#fffbeb` | 施工/任务阻塞 |

### 边框与分隔线
| Token | 色值 | 用途 |
|-------|------|------|
| `--line` | `#e0d8cc` | 标准边框、分隔线 |
| `--line-subtle` | `#eae5dc` | 微妙边框、内部分隔 |

### 阴影
| Token | 值 | 用途 |
|-------|-----|------|
| `--shadow-sm` | `0 1px 2px rgba(28,25,23,0.04)` | 极轻微抬升 |
| `--shadow` | `0 4px 16px rgba(28,25,23,0.06)` | 卡片、下拉菜单 |
| `--shadow-lg` | `0 12px 40px rgba(28,25,23,0.08)` | 模态框、抽屉 |

---

## 3. 字体规则

### 字体族
- **主字体（正文/UI）**：`PingFang SC`, `Noto Sans SC`, `Microsoft YaHei`, sans-serif
- **衬线字体（标题/展示）**：`Noto Serif SC`, `Source Han Serif SC`, `STSong`, `SimSun`, serif
- **展示字体（英文装饰）**：`Cormorant Garamond`, `Georgia`, `Times New Roman`, serif

### 层级

| 角色 | 字体 | 大小 | 字重 | 行高 | 字间距 | 备注 |
|------|------|------|------|------|--------|------|
| 页面标题 | 衬线 | 28px | 600 | 1.2 | -0.02em | 运营页面顶部标题 |
| 区块标题 | 无衬线 | 18px | 600 | 1.3 | -0.01em | 卡片/表格区块标题 |
| 卡片标题 | 无衬线 | 15px | 600 | 1.4 | 0 | 卡片内标题 |
| 正文 | 无衬线 | 14px | 400 | 1.6 | 0 | 标准阅读文字 |
| 正文强调 | 无衬线 | 14px | 600 | 1.6 | 0 | 表格标题、标签 |
| 小字 | 无衬线 | 13px | 400 | 1.5 | 0 | 元数据、时间戳 |
| 标签 | 无衬线 | 12px | 500 | 1.4 | 0.02em | badge、状态标签 |
| 微字 | 无衬线 | 11px | 500 | 1.4 | 0.04em | 导航小字、图例 |

---

## 4. 组件规则

### 页面头部（Page Header）
- 布局：flex，标题左 + 操作右
- 标题：`font-size: 28px`，衬线字体，字重 600
- 副标题：`font-size: 14px`，`color: var(--muted)`，最大宽度 480px
- 底部边框：`1px solid var(--line-subtle)`，padding-bottom 16px，margin-bottom 24px

### 指标卡片（Metric Card）
- 背景：`var(--card)`
- 边框：`1px solid var(--line-subtle)`
- 圆角：`var(--radius)`（10px）
- 内边距：20px
- 标签：`font-size: 13px`，`color: var(--muted)`
- 数值：`font-size: 28px`，字重 600，`color: var(--ink)`
- 变体：`.accent` 使用 `--accent-soft` 背景 + `--accent` 数值色

### 徽章（Badge）
- 基础：padding `3px 8px`，圆角 `var(--radius-sm)`（6px），`font-size: 12px`
- 默认：`background: var(--accent-muted)`，`color: var(--accent)`
- 成功：`background: var(--olive-soft)`，`color: var(--olive)`
- 警告：`background: #fffbeb`，`color: #b45309`

### 表格（Table）
- 表头：`font-size: 12px`，`color: var(--muted)`，`font-weight: 600`，大写 tracking
- 单元格：`font-size: 14px`，padding `12px 16px`
- 行悬停：`background: var(--hover)`
- 边框：仅水平分隔线 `1px solid var(--line-subtle)`

### 空态（Empty State）
- 居中布局，min-height 40vh
- 图标容器：64px 圆角方块，`background: var(--card)`，`border: 1px solid var(--line)`
- 标题：`font-size: 18px`，字重 600
- 描述：`font-size: 14px`，`color: var(--muted)`，max-width 360px
- 操作按钮：`.atelier-empty-btn`

### 内联错误（Inline Error）
- 文字：`font-size: 13px`，`color: #991b1b`
- 背景：`#fef2f2`
- 边框：`1px solid #fecaca`
- 圆角：`var(--radius-sm)`

### 操作栏（Action Bar）
- 布局：flex，gap 8px
- 主按钮：`background: var(--accent)`，`color: #fff`，hover `background: var(--accent-hover)`
- 次按钮：`background: var(--card)`，`border: 1px solid var(--line)`，hover `background: var(--hover)`

---

## 5. 布局规则

### 侧边栏
- 宽度：256px（展开），72px（收起）
- 背景：`var(--sidebar-bg)`
- 右侧边框：`1px solid var(--line)`
- 内边距：20px

### 主内容区
- 左侧 margin：适配侧边栏宽度
- 顶部 padding：32px
- 最大内容宽度：无限制（运营工作台需要宽表格）

### 响应式断点
- 桌面：> 1024px，完整侧边栏
- 平板：768px–1024px，侧边栏收起
- 手机：< 768px，底部导航栏，侧边栏隐藏

---

## 6. 与 Linear 参考的关系

Linear 的设计在以下方面提供了有价值的参考：
- **信息层级**：标题 → 副标题 → 正文 → 元数据的字号梯度
- **卡片系统**：统一的圆角、阴影、边框策略
- **表格密度**：表头小字 + 行悬停反馈
- **交互反馈**：悬停状态、焦点态的细腻过渡

但以下方面不跟随 Linear：
- **颜色**：不使用深色背景、靛紫色强调色
- **字体**：不使用 Inter Variable 的负字间距策略（中文需要更宽松的间距）
- **氛围**：追求温暖安静而非精密冷峻
