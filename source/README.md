# Yara Al-Mansouri, PhD — portfolio

A single-page portfolio built from one source: the CV. Every fact on the page comes from it, and each fact appears in one place only.

## Stack

Vite 6 · React 19 · TypeScript 5 (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) · CSS Modules with design tokens · Vitest + Testing Library · Playwright + axe-core.

## Scripts

| Command                | What it does                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Local dev server                                                                                                                   |
| `npm run build`        | Type-check, then production build to `dist/` (relative paths, deployable to any folder)                                            |
| `npm run preview`      | Serve the build                                                                                                                    |
| `npm run typecheck`    | `tsc -b --noEmit`                                                                                                                  |
| `npm run lint`         | ESLint (typescript-eslint strict, jsx-a11y strict, react-hooks), zero warnings allowed                                             |
| `npm run format:check` | Prettier                                                                                                                           |
| `npm test`             | 38 unit and component tests                                                                                                        |
| `npm run test:e2e`     | 18 browser tests (3 viewports), including axe WCAG 2.2 AA scans in day and night themes. Set `CHROME_PATH` to use a system Chrome. |

## Structure

```
src/
  data/        typed CV content (projects, experience, skills, research, profile)
  lib/         pure logic: role-fit matcher, contact validation + mailto, clipboard, downloads
  hooks/       reduced motion, in-view, scroll spy, theme, scroll lock, scroll progress
  state/       portfolio context: open project (synced to URL hash), filters, navigation
  components/  ui primitives (Button, Tabs, Dialog, Toast, FilterGroup) and one folder per section
  styles/      tokens.css (colour, type, spacing) and base.css
tests/unit/    content invariants, logic and component tests
e2e/           Playwright end-to-end and accessibility tests
```

## Quality rules enforced by tests

- Content: project ids are complete and unique; awards and experience link only to real projects; no project figure is repeated in its own prose, in the timeline, or as a headline number.
- Accessibility: WAI-ARIA tabs with arrow/Home/End keys; modal dialog with focus trap, Escape and focus restore; labelled form errors with focus on the first one; colour contrast verified at 4.5:1 or above in both themes.
- Behaviour: deep links such as `#savings` open the matching project; stack filters announce their result; no console errors and no horizontal overflow at any viewport.
