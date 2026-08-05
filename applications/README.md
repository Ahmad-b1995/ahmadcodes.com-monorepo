# University applications

LaTeX motivation letters, academic CV, and pre-application inquiry
templates for the Italy + Germany university applications targeting
**September 2027** (Italy) and **Winter 2027/2028** (Germany via Studienkolleg).

## Build

```bash
# From workspace root
pnpm applications:build

# Or directly
cd applications
pdflatex cv-academic.tex && pdflatex cv-academic.tex
pdflatex motivation-trento-cs.tex && pdflatex motivation-trento-cs.tex
# (etc. for each motivation letter)
```

Generated PDFs are gitignored. Re-run the build whenever you edit.

## Files

```
applications/
  cv-academic.tex                              The academic CV (Europass-style).
  _letter-preamble.tex                         Shared LaTeX header for all letters.

  motivation-trento-cs.tex                     Italy — University of Trento, BSc Computer Science (English)
  motivation-bologna-digital-humanities.tex    Italy — University of Bologna, BSc Digital Humanities
  motivation-camerino-cs.tex                   Italy — Università di Camerino, BSc Computer Science (safety net)
  motivation-tu-berlin-studienkolleg.tex       Germany — TU-Studienkolleg T-Kurs → TU Berlin BSc Informatik

  pre-application-inquiry-italy.md             Template + university contact emails for Italy
  pre-application-inquiry-germany.md           Template + university/Studienkolleg contacts for Germany
```

## Workflow

1. **Before applying** — send the pre-application inquiry email from
   `pre-application-inquiry-italy.md` (or `-germany.md`) to each target
   university. Fill in `{{Programme Name}}` and any other placeholders.
2. **When you get a positive reply** — customize the relevant motivation letter:
   - Update the date in the letter heading
   - Customize the per-university paragraph with details from their reply
     (specific professors mentioned, specific programmes confirmed,
     additional documents requested)
   - Build the PDF
3. **Submit** — via Universitaly (Italy) or uni-assist / direct (Germany).

## What to customize per university

Each motivation letter has a clearly identifiable "why this university"
paragraph (paragraph 4 in the structure). When you receive a positive reply
from a university:

- Update specific faculty names / research labs / programme features
  mentioned in their reply
- Reference any specific suggestions they made
- Update the address block at the top if the address has changed

## Reviewing the letters

Before sending any letter, check:

- [ ] University name spelled correctly everywhere
- [ ] Programme name matches their official website exactly
- [ ] Address matches the current admissions office address
- [ ] Date in the letter is current
- [ ] No fabricated metrics anywhere
- [ ] OSS repo link works
- [ ] Personal contact info correct
- [ ] At least one specific faculty/programme detail showing you read their site

## Native English proofreading

Before submitting, get the English-language letters read by a native speaker.
Cheapest options:

- ProofreadingPal (~$25 for 1,000 words, 24h turnaround)
- Fiverr "English editor for university applications" (~$15-30)
- Reddit r/proofreading (free, slower)

## German letter notes

The TU-Berlin letter has a German closing ("Mit freundlichen Grüßen").
For the body, German universities accept English from non-EU applicants
for Studienkolleg inquiries. Once you're applying for the Bachelor's
proper (after Studienkolleg), expect to write in German. Build that
up via language classes during Studienkolleg.
