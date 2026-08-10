# Resume

Two variants, both built by `build.sh` and copied into `apps/web/public/`:

| File | Use for | Served at |
|---|---|---|
| `ahmad-bagheri-resume.tex` | NetSuite/ERP/integration roles, freelance outreach | `ahmadcodes.com/ahmad-bagheri-resume.pdf` |
| `ahmad-bagheri-resume-fullstack.tex` | Generic React/Node/full-stack job applications | `ahmadcodes.com/ahmad-bagheri-resume-fullstack.pdf` |

Same facts in both — only the emphasis differs (the full-stack variant demotes
NetSuite from headline specialty to one differentiator line). Keep them in
sync when adding new experience.

## Build

```bash
# From the workspace root
pnpm resume:build               # build the resume only
pnpm resume:build:previews      # build the resume + slate/blue/cyan/emerald color previews
```

Or directly:

```bash
./resume/build.sh
./resume/build.sh --previews
```

## Editing

Edit `ahmad-bagheri-resume.tex`. Re-run the build script. The script invokes
`pdflatex` twice (the second pass resolves cross-references).

The accent color is defined at the top of the `.tex` file as three matching
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
