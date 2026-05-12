# DESIGN_OVERRIDES.md

Override rules that deviate from `DESIGN.md`. Always prefer `DESIGN.md` unless an override is explicitly listed here.

## 1. Calendar Grid Layout

DESIGN.md section 6 defines generic data table styles (`.table-wrapper`, `.format-cell`, `.value-cell`, etc.). This project uses a full-viewport calendar grid with swipe interaction instead. The calendar table inherits from the DESIGN.md table spec where applicable (border-collapse, padding, font sizes, header styling, hover, zebra stripes), but layout and swipe-specific styles differ entirely.

## 2. Theme Toggle Icon

DESIGN.md section 3.4 suggests `◐` as the toggle button content. This project uses emoji icons (`☀️` / `🌙`) instead for clearer visual feedback.

