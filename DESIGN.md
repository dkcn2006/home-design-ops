# Design System

This file defines the visual direction for `home-design-ops`.
When implementing or revising frontend UI, follow this document before inventing new styles.

## Design direction

Adopt a Notion-inspired product style for this repository.

This does not mean copying Notion literally.
It means using these qualities as the primary reference:

- quiet
- document-like
- structured
- readable
- low-noise
- trustworthy

The project should feel like:

- a Notion-style workspace for renovation operations
- a project archive system with calm editorial spacing
- a practical internal tool with a warm Chinese business context

Avoid making it look like:

- a glossy landing page
- a glassmorphism-heavy dashboard
- a template SaaS admin panel
- a dark, neon, or over-branded product

## Core visual language

Keep the warm renovation context, but express it through a restrained Notion-like system.

- Use light paper-like backgrounds.
- Prefer solid surfaces over frosted glass effects.
- Borders should be visible but soft.
- Use modest corner radii rather than oversized rounded cards.
- Shadows should be minimal and rare.
- Layout should feel like a workspace, not a visual showcase.
- Typography should do more of the hierarchy work than decoration.

## Color direction

Use a muted neutral palette with one warm accent.

- `--bg`: warm paper workspace background
- `--card`: solid document/card surface
- `--ink`: primary text
- `--muted`: supporting text
- `--accent`: restrained warm brown highlight
- `--accent-soft`: quiet warm tag background
- `--olive`: muted secondary emphasis
- `--line`: light separators

### Color intent

- Most UI should remain neutral.
- Accent is for selected action, light emphasis, and important pills.
- Large sections should not rely on color blocks for hierarchy.
- Backgrounds should stay warm-neutral, close to paper and plaster.
- Do not introduce saturated blue, purple, or glossy gradients as primary identity.

## Typography

- Prioritize Chinese readability.
- Prefer `"PingFang SC"`, `"Noto Sans SC"`, `"Microsoft YaHei"`, sans-serif.
- Headlines should be simple, direct, and slightly editorial.
- Body copy should stay concise and operational.
- Labels, metadata, and helper text should remain soft and quiet.
- Avoid oversized marketing-style typography on workflow screens.

## Layout rules

- Prefer page sections that read like structured documents.
- Use panels, grouped blocks, lists, and calm tables.
- Important pages should have:
  - a hero or header region
  - summary stats or key context
  - one or more operational sections
- Default page rhythm:
  - header / hero
  - summary
  - working area
  - detail area

## Component guidance

### Cards

- Cards should feel like document blocks.
- Prefer borders and background contrast over shadow.
- Keep spacing generous and visual noise low.
- Make headers readable without decorative chrome.

### Tables

- Tables should remain simple and readable.
- Avoid dense enterprise-grid styling.
- Keep rows clean with clear column intent.
- Use subtle separators like a document database, not heavy gridlines.

### Forms

- Forms should feel like editing structured notes.
- Inputs should be clean, light, and rectangular with modest radius.
- Group related fields clearly.
- Multi-column forms are good on desktop, but must collapse cleanly on mobile.

### Buttons

- Primary buttons should be quiet and confident, not flashy.
- Secondary buttons should feel like subtle utility controls.
- Avoid glossy, floating, or over-stylized buttons.

### Tags and pills

- Use rounded pills for status, module identity, and compact metadata.
- Tags should help scanning, not dominate the page.
- Tags should feel like Notion-style property chips more than badges from a marketing site.

## Interaction style

- Motion should be subtle.
- Prefer calm transitions over flashy micro-animations.
- Hover feedback should rely on background, border, and text emphasis shifts.
- Do not introduce animation unless it helps orientation.

## Page patterns for this project

### Home page

Should communicate:

- system scope
- current operational status
- next actions
- entry points into major workflows

### Role pages

Should feel like focused workbenches.

- keep role identity clear
- show metrics, current focus, and shared project facts
- avoid turning role pages into marketing pages

### Project archive page

This is the core page of the product.
It should feel like the single source of truth.

- Organize information like a well-structured operating document.
- Keep customer, design, quotation, delivery, and confirmation sections clearly separated.
- Support dense information, but preserve scanning comfort.

### Client portal page

Should be simpler and clearer than internal pages.

- Reduce internal jargon.
- Highlight actionable items.
- Keep trust and clarity above density.
- Make the tone calmer and more human than internal dashboards.

### Sales lead page

Should combine intake efficiency and pipeline visibility.

- Forms should be welcoming and fast to complete.
- Stage boards should be easy to scan.
- Pipeline cards should emphasize customer identity, source, budget, and current next step.
- The page should feel like editing and reviewing a living workspace database.

## Implementation rules for AI

When asked to implement a page or redesign an existing page:

1. Reuse existing CSS variables before adding new ones.
2. Preserve a warm-neutral Notion-like visual language.
3. Prefer extending existing component classes and layout patterns over inventing a brand-new system.
4. Keep mobile behavior explicit.
5. Avoid visual noise.
6. Avoid dark mode unless explicitly requested.
7. Avoid purple, electric blue, glossy gradients, and generic template aesthetics.
8. Make operations pages feel trustworthy, calm, and document-oriented.

## What good output looks like

Good output should feel like:

- a serious renovation workspace rendered with Notion-like restraint
- an internal tool that still has taste
- a system designed for real collaboration, not demo-only marketing visuals

## What bad output looks like

Bad output includes:

- flashy gradients everywhere
- generic startup hero sections on workflow pages
- dense enterprise tables with no visual hierarchy
- too many colors
- too many shadows
- inconsistent card shapes
- pages that look unrelated to each other
- oversized glassmorphism surfaces
- buttons and badges that attract more attention than the content

## Default instruction for AI sessions

If the user asks for UI, page redesign, component styling, or frontend polish:

- read this file first
- keep the current warm Notion-inspired operational design system
- implement directly in code
- prefer concrete page improvements over abstract design commentary
