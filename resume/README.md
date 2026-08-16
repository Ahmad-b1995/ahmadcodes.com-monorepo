# Resume

Six variants, all built by `build.sh` and copied into `apps/web/public/`.
Same facts in every file — only the emphasis changes. Pick the one that
matches the job. Do not send the ERP variant to a generic React/Node listing.

| File | Use for | Served at |
|---|---|---|
| `ahmad-bagheri-resume.tex` | NetSuite / ERP / SuiteScript / integration roles | `ahmadcodes.com/ahmad-bagheri-resume.pdf` |
| `ahmad-bagheri-resume-fullstack.tex` | Generic React / Node / TypeScript full-stack jobs (**default for most applications**) | `ahmadcodes.com/ahmad-bagheri-resume-fullstack.pdf` |
| `ahmad-bagheri-resume-frontend.tex` | Senior React / Next.js / frontend-heavy roles | `ahmadcodes.com/ahmad-bagheri-resume-frontend.pdf` |
| `ahmad-bagheri-resume-python.tex` | Django / Python backend or Python full-stack roles | `ahmadcodes.com/ahmad-bagheri-resume-python.pdf` |
| `ahmad-bagheri-resume-devops.tex` | Platform / DevOps-adjacent roles that want Docker, Linux, CI, self-hosted prod. **Not** for Kubernetes SRE listings. | `ahmadcodes.com/ahmad-bagheri-resume-devops.pdf` |
| `ahmad-bagheri-resume-ai.tex` | LLM-platform / agent-engineering / AI-native product roles. Leads with Loam and the Dextrading AI API. Never add tools not actually used (Langfuse, Airflow, etc.). | `ahmadcodes.com/ahmad-bagheri-resume-ai.pdf` |

Keep them in sync when adding new experience. Change the facts in all five,
or the variants will drift.

## Build

```bash
# From the workspace root
pnpm resume:build               # build all variants
pnpm resume:build:previews      # also produce slate/blue/cyan/emerald color previews of the ERP file
```

Or directly:

```bash
./resume/build.sh
./resume/build.sh --previews
```

## Editing

Edit the `.tex` file for the variant you want. Re-run the build script. The
script invokes `pdflatex` twice (the second pass resolves cross-references).

The accent color is defined at the top of each `.tex` file as three matching
`\definecolor{accentTitle/Text/Line}{HTML}{...}` declarations. Change all three
to the same hex to swap the theme color globally.

## Requirements

```bash
sudo apt install texlive-latex-extra texlive-fonts-extra
```

## Notes

- `previews/` (gitignored) holds color comparison PDFs.
- Numbers and metrics in this resume describe shipped work in qualitative
  terms when the underlying figures are still under measurement or under NDA.
  Keep that policy in future edits.
- Do not invent Kubernetes, Terraform, or deep NestJS internals that would
  not survive a 30-minute interview.
