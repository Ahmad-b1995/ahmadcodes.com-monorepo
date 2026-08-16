#!/usr/bin/env bash
# Build the resume PDF and copy it into the web app's public folder so it's
# served at https://ahmadcodes.com/ahmad-bagheri-resume.pdf.
#
# Usage:
#   ./resume/build.sh           # build with current colors
#   ./resume/build.sh --previews  # also build slate/blue/cyan/emerald previews
#
# Requires: texlive-latex-extra, texlive-fonts-extra (Debian/Ubuntu).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SOURCE_TEX="ahmad-bagheri-resume.tex"
OUTPUT_PDF="ahmad-bagheri-resume.pdf"
PUBLIC_DIR="${WORKSPACE_ROOT}/apps/web/public"

# Extra variants built alongside the ERP default. Same facts, different emphasis.
VARIANTS=(
  "ahmad-bagheri-resume-fullstack.tex"
  "ahmad-bagheri-resume-python.tex"
  "ahmad-bagheri-resume-devops.tex"
  "ahmad-bagheri-resume-frontend.tex"
  "ahmad-bagheri-resume-ai.tex"
)

cd "${SCRIPT_DIR}"

build_tex () {
  local tex_file="$1"
  echo "==> Building ${tex_file}"
  pdflatex -interaction=nonstopmode -halt-on-error "${tex_file}" >/dev/null
  pdflatex -interaction=nonstopmode -halt-on-error "${tex_file}" >/dev/null
}

build_once () {
  # Kept for the previews flow, which rewrites SOURCE_TEX in place.
  local label="$1"
  echo "==> Building ${label}"
  pdflatex -interaction=nonstopmode -halt-on-error "${SOURCE_TEX}" >/dev/null
  pdflatex -interaction=nonstopmode -halt-on-error "${SOURCE_TEX}" >/dev/null
}

clean_aux () {
  rm -f *.aux *.log *.out *.toc *.fdb_latexmk *.fls *.synctex.gz
}

main () {
  build_tex "${SOURCE_TEX}"
  cp -f "${OUTPUT_PDF}" "${PUBLIC_DIR}/${OUTPUT_PDF}"
  echo "==> Copied to ${PUBLIC_DIR}/${OUTPUT_PDF}"

  for tex_file in "${VARIANTS[@]}"; do
    if [[ -f "${tex_file}" ]]; then
      local pdf_file="${tex_file%.tex}.pdf"
      build_tex "${tex_file}"
      cp -f "${pdf_file}" "${PUBLIC_DIR}/${pdf_file}"
      echo "==> Copied to ${PUBLIC_DIR}/${pdf_file}"
    fi
  done

  if [[ "${1:-}" == "--previews" ]]; then
    build_previews
  fi

  clean_aux

  if [[ "${1:-}" == "--with-applications" || "${2:-}" == "--with-applications" ]]; then
    build_applications
  fi
}

build_applications () {
  local apps_dir="${WORKSPACE_ROOT}/applications"
  if [[ ! -d "${apps_dir}" ]]; then return; fi
  echo "==> Building application documents in ${apps_dir}"
  cd "${apps_dir}"
  for f in cv-academic.tex motivation-*.tex; do
    [[ -f "${f}" ]] || continue
    echo "    --> ${f}"
    pdflatex -interaction=nonstopmode -halt-on-error "${f}" >/dev/null
    pdflatex -interaction=nonstopmode -halt-on-error "${f}" >/dev/null
  done
  rm -f *.aux *.log *.out *.toc *.fdb_latexmk *.fls *.synctex.gz
  cd "${SCRIPT_DIR}"
}

build_previews () {
  local previews_dir="${SCRIPT_DIR}/previews"
  mkdir -p "${previews_dir}"

  # Each variant: name|hex
  local variants=(
    "purple|6B46C1"
    "slate|334155"
    "blue|1d4ed8"
    "cyan|0e7490"
    "emerald|047857"
  )

  cp "${SOURCE_TEX}" "${SOURCE_TEX}.bak"

  for variant in "${variants[@]}"; do
    local name="${variant%%|*}"
    local hex="${variant##*|}"
    echo "==> Building preview: ${name} (#${hex})"
    sed -E "s/\\\\definecolor\\{accentTitle\\}\\{HTML\\}\\{[A-F0-9]+\\}/\\\\definecolor{accentTitle}{HTML}{${hex}}/" "${SOURCE_TEX}.bak" \
      | sed -E "s/\\\\definecolor\\{accentText\\}\\{HTML\\}\\{[A-F0-9]+\\}/\\\\definecolor{accentText}{HTML}{${hex}}/" \
      | sed -E "s/\\\\definecolor\\{accentLine\\}\\{HTML\\}\\{[A-F0-9]+\\}/\\\\definecolor{accentLine}{HTML}{${hex}}/" \
      > "${SOURCE_TEX}"
    build_once "${name}"
    cp -f "${OUTPUT_PDF}" "${previews_dir}/ahmad-bagheri-resume-${name}.pdf"
  done

  mv "${SOURCE_TEX}.bak" "${SOURCE_TEX}"
  echo "==> Previews in ${previews_dir}/"
}

main "$@"
