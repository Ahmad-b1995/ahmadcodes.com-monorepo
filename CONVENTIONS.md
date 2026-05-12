# Code conventions

> Hard rules and soft preferences for code in this monorepo. Read once
> when you join, follow always. Public — fine to commit.

This is the reference. When in doubt, pick what's already in the codebase
over what's "best" in an abstract sense. Consistency beats correctness when
both are reasonable.

---

## 1. Hard rules (never break)

1. **No secrets in code or commits.** Anything sensitive goes in `.env`
   (already gitignored). Personal plans (`REMINDERS.md`, `TODO.md`,
   `private/`) also gitignored. Verify with `git status --ignored` if unsure.
2. **No fabricated metrics in user-facing copy.** Resume, About section,
   project descriptions: describe shipped work qualitatively unless you can
   defend the number in a 30-minute interview.
3. **No `any` in new TypeScript code.** Use `unknown` and narrow, or define
   a real interface. Existing `any`s are tech debt, not a license.
4. **No `console.log` in production paths.** Use the logger you have, or
   structured logging. `console.log` is fine inside `if (DEBUG)` blocks.
5. **Migrations are forward-only by default.** TypeORM migrations live in
   `apps/api/src/migrations/`. Each PR that changes the schema ships a
   migration. Never edit a migration after it's run in production.
6. **Lint before push.** `pnpm lint` on the changed app must be clean.

## 2. Repository layout

```
apps/
  api/        NestJS — backend, owns the DB
  web/        Next.js 15 — public site
  cms/        Vite + React — admin
packages/
  shared/         DTOs and HTTP client classes
  eslint-config/  Shared lint config
  typescript-config/  Shared tsconfig
resume/      LaTeX source + build script
assets/      Marketing assets (banner exports, logos) — public artifacts
```

Rules:

- **Cross-app code goes in `packages/`**, never duplicated. If `cms` and
  `web` both need a type, it goes in `packages/shared/src/dtos/`.
- **`api` owns the schema.** `cms` and `web` import types from
  `@repo/shared`, never define their own copy of an entity shape.
- **Frontend talks to backend only through `@repo/shared/http`.** Don't
  hand-roll fetch calls in components.

## 3. TypeScript & React

- **Functions over classes**, except for NestJS providers and HTTP service
  classes in `packages/shared/http`.
- **Named exports** from feature modules. Default exports only for Next.js
  pages/layouts that require them.
- **Interfaces for DTOs** (prefix `I` is OK here because it matches the
  existing pattern in `packages/shared/src/dtos/`). **Types for unions and
  helpers.**
- **`async/await` everywhere.** No `.then()` chains except in top-level
  fire-and-forget cases.
- **No barrel files that re-export everything.** The `index.ts` files in
  `packages/shared` are the exception because they're a public API.
- **Components are functions.** Use `function Component(...)` for top-level
  components, arrow functions for inline callbacks.
- **State lives close to its use.** Push state up only when more than one
  component needs it. Avoid prop drilling more than ~3 levels — extract
  context if needed.

## 4. Styling

- **Tailwind v4** in `apps/web` and `apps/cms` (CMS has been on v4; `web`
  was migrated). Theme tokens come from CSS variables (`--primary-*`,
  `--background`, etc.) so light/dark switching works without touching
  components.
- **Dark mode is class-based** (`html.dark`). Use Tailwind `dark:`
  variants, not media queries.
- **No inline hex colors in components.** Use `bg-primary-700`,
  `text-primary-300`, etc. Anything that needs a custom value goes into
  `globals.css` (`apps/web`) or `theme.css` (`apps/cms`).
- **Spacing scale**: stick with Tailwind's defaults (`gap-2`, `p-4`,
  `mt-6`). No magic pixel values unless visually justified.
- **shadcn/ui style.** New UI primitives go in `components/ui/` and follow
  the existing kebab-case file naming and small-component-per-file pattern.

## 5. Naming

- **Files**: kebab-case for components and routes (`mail-list.tsx`),
  PascalCase only inside the file for the exported component.
- **Components**: `PascalCase`.
- **Hooks**: `useThing()` — always start with `use`.
- **Boolean variables/props**: `isLoading`, `hasError`, `canEdit`,
  `shouldRender`. Don't use raw nouns for booleans.
- **DB column names**: `snake_case`. TypeORM entity properties:
  `camelCase`, mapped via `@Column({ name: 'snake_case' })`.

## 6. Reusability checklist

Before duplicating code, ask:

- **Is there already a UI primitive in `components/ui/`** that does what I
  need with different props?
- **Is there a hook in `features/<x>/hooks/`** that does this fetch
  pattern? If similar, extract a generic hook in `lib/`.
- **Is this a DTO that another app might need?** If yes, put it in
  `packages/shared/src/dtos/` even if only one app uses it today.
- **Is this a constant or enum used in more than one file?** Put it in a
  `data/<thing>.ts` or `lib/<thing>.ts`, not inline.

If you copy-paste three times, on the third paste extract a function.

## 7. Dead code policy

- **Delete on sight.** Unused imports, unused variables, commented-out
  blocks, "just in case" parameters — delete. Git remembers everything.
- **Use `knip`** to find unused files, exports, and deps:
  ```bash
  cd apps/<x> && pnpm knip
  cd apps/web && pnpm dlx knip
  ```
  Run quarterly. Fix what's safe (verify imports manually for false
  positives, e.g. `@repo/shared` subpath imports).
- **One commented-out block can stay** if it's pending a near-term reactivation
  (e.g. the `<Blog/>` line in `Homepage.tsx`). Mark with a clear comment
  explaining when it'll come back.

## 8. Commits & PRs

- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`,
  `test:`, `build:`. Scopes like `feat(mail):`, `fix(web):` are encouraged.
- **One logical change per commit.** Don't mix refactor + feature + style.
- **PR descriptions answer**: what changed, why, how to test it. Two
  paragraphs max.
- **No `--no-verify` to skip hooks** unless you can defend it in the PR
  description.

## 9. Dependencies

- **Add deps deliberately.** Each new dep ships in your bundle and you
  inherit its bugs. Prefer the standard library or 20 lines of code over a
  one-trick dep.
- **Update minor/patch versions monthly.** Major versions only after
  reading release notes.
- **`pnpm outdated --recursive`** to see what's behind.
- **Don't downgrade silently.** If a major version breaks you, file an
  issue or write a small adapter; don't quietly pin to an old version
  without a comment.

## 10. Testing (future)

The codebase doesn't have great test coverage today. When you add tests:

- **Unit tests next to source**: `mail.service.spec.ts` next to
  `mail.service.ts`. Jest in `api`, Vitest in `cms`/`web`.
- **Integration tests in `test/`** for `apps/api` (already wired).
- **No snapshot tests for HTML.** They're noisy and rarely catch real
  regressions.
- **Test behavior, not implementation.** "When I submit valid mail, a
  `sent` row appears" beats "service.send is called with X args."

## 11. Performance

- **Don't optimize before measuring.** If a page is slow, profile first.
- **Server components by default** in `apps/web` (Next 15 App Router).
  `'use client'` only when you need state, effects, or browser-only APIs.
- **Lazy-load heavy components** (TipTap, ResizablePanels) with dynamic
  imports if they're not on the critical path.

## 12. Accessibility

- **Every interactive thing has a label.** `aria-label`, visible text, or
  both.
- **Color is not the only signal.** Status badges have both color and
  text. Error states have both icon and message.
- **Keyboard navigation works.** Test by tabbing through a new page once
  before merging.

---

If something here is wrong or outdated, fix it in this file in the same PR.
Don't let conventions drift from reality.
