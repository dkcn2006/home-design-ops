# Project Instructions

## Language for plans and proposals

For any product plan, technical plan, roadmap, implementation proposal, architecture proposal, design proposal, or decision memo in this repository:

- write the main content in Simplified Chinese
- keep code identifiers, API paths, file paths, type names, command names, and proper nouns in their original form when clearer
- if an English version is explicitly requested, provide English only for that request
- prefer concrete, executable wording over abstract strategy language

## Design source of truth

For any frontend design, UI polish, layout adjustment, component styling, or page redesign work in this repository:

- read `DESIGN.md` first
- treat `DESIGN.md` as the design source of truth
- preserve the current warm operational design language
- avoid introducing a conflicting visual system unless the user explicitly asks for a redesign

## Frontend implementation preference

- prefer extending existing styles in `apps/web/app/globals.css`
- keep pages visually related to each other
- prioritize clarity, hierarchy, and operational usability
- ensure desktop and mobile layouts both remain usable
