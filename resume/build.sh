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

cd "${SCRIPT_DIR}"

build_once () {
  local label="$1"
  echo "==> Building ${label}"
  pdflatex -interaction=nonstopmode -halt-on-error "${SOURCE_TEX}" >/dev/null
  pdflatex -interaction=nonstopmode -halt-on-error "${SOURCE_TEX}" >/dev/null
}

clean_aux () {
  rm -f *.aux *.log *.out *.toc *.fdb_latexmk *.fls *.synctex.gz
}

main () {
  build_once "default"
  cp -f "${OUTPUT_PDF}" "${PUBLIC_DIR}/${OUTPUT_PDF}"
  echo "==> Copied to ${PUBLIC_DIR}/${OUTPUT_PDF}"

  if [[ "${1:-}" == "--previews" ]]; then
    build_previews
  fi

  clean_aux
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
