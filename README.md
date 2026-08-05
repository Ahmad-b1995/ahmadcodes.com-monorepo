# ahmadcodes.com

Personal site, blog, and CMS for [ahmadcodes.com](https://ahmadcodes.com).

A Turborepo monorepo with three apps:

| App   | Stack                                              | Purpose                                       |
| ----- | -------------------------------------------------- | --------------------------------------------- |
| `web` | Next.js 15 · React 19 · Tailwind v4                | Public site, portfolio, blog reader           |
| `api` | NestJS 11 · TypeORM · Postgres · S3                | Article CRUD, auth, image uploads             |
| `cms` | React 19 · Vite · TanStack Router/Query · TipTap   | Single-user admin to write and publish posts  |

Self-hosted on [Dokploy](https://dokploy.com), Postgres on the same private
network, Minio for image storage. Self-built rather than something off-the-shelf
because (a) integration practice and (b) full control over the article schema.

## Repo layout

```
apps/
  web/        Next.js public site (ahmadcodes.com)
  api/        NestJS API (api.ahmadcodes.com)
  cms/        React/Vite admin (cms.ahmadcodes.com)
packages/
  shared/         Shared DTOs, HTTP client, utilities
  eslint-config/  Shared ESLint config
  typescript-config/  Shared tsconfig presets
resume/
  ahmad-bagheri-resume.tex   LaTeX source for the resume PDF served on the site
  build.sh                   Build the PDF (and optional color previews)
```

## Develop

```bash
# Install
pnpm install

# Run all apps with hot reload
pnpm dev

# Or one app at a time
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter cms dev
```

The dev compose stack (`docker-compose.yml`) runs Postgres + the apps locally.

## Build

```bash
pnpm build
pnpm resume:build               # compile resume PDF -> apps/web/public/
pnpm resume:build:previews      # also produce color comparison PDFs
```

## Deploy

Each app deploys as its own Docker service on Dokploy:

- `web` → `https://ahmadcodes.com`
- `api` → `https://api.ahmadcodes.com`
- `cms` → `https://cms.ahmadcodes.com`

Postgres and Minio are also Dokploy services on the private network.

## Article workflow

1. Sign in to the CMS at `cms.ahmadcodes.com`
2. Articles → "Add Article" → write in the TipTap WYSIWYG → toggle Publish → Save
3. Article appears at `ahmadcodes.com/blog/<slug>` immediately

Article HTML is stored as TipTap output and rendered with `prose` styles on
the public side. Markdown is intentionally not used.

## Conventions

Read [`CONVENTIONS.md`](./CONVENTIONS.md) once before submitting code.
Covers naming, styling, reusability, dead-code policy, commits.

## Roadmap (not v1)

- Email subscriber list capture on the blog
- Article scheduling (publish at future date)
- Tag pages on the public site
- RSS feed
- Analytics in the CMS dashboard

## Resume

LaTeX source for the resume that's linked from the site lives in `resume/`.
See `resume/README.md`.

## University applications

LaTeX motivation letters, academic CV, and pre-application templates for
Italy + Germany live in `applications/`. See `applications/README.md`.

```bash
pnpm applications:build
```

## License

All rights reserved. Code is publicly visible for portfolio reasons but not
licensed for reuse.
