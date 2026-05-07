# Resume

LaTeX source for `ahmad-bagheri-resume.pdf`. The compiled PDF is served by the
web app at `https://ahmadcodes.com/ahmad-bagheri-resume.pdf` after running the
build script (it copies the output into `apps/web/public/`).

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
