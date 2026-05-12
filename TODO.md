# TODO

Refactor this project: kick a-h templ, move all frontend logic to Go WASM.

## Templ Migration (html/template)

- [x] Create `templates/index.html` using `html/template` syntax
- [x] `cmd/shift-scheduler/templates.go` — `template.Template` via `Parse("templates/*.html")`
- [x] Router wires `tmpls` for `/` route via `handleIndex`
- [x] `cmd/shift-scheduler/handlers.go` — template data types (`IndexTD`, `GridTD`, `GridCellTD`) and handler logic
- [x] Migrate calendar grid and swipe containers from old `.templ` to `index.html`
- [ ] `internal/handlers/app.go` — still imports old templ (`templates/pages`), rewrite or remove (no longer wired)
- [ ] `go.mod` — remove `github.com/a-h/templ` dependency
- [x] `Makefile` — remove `templ generate` from `init`/`generate` targets, add `dev` target
- [ ] Delete old `.templ` backup files in `templates/.pages/` and `templates/.components/`
- [ ] Clean up gitignore — remove `*_templ.go` once old files are deleted

## WASM Rework

The WASM binary (`cmd/wasm/`) currently depends on old templ packages to dynamically render grid HTML on swipe. This must be migrated to `html/template` and then extended.

### Critical: Remove templ dependency from WASM

- [ ] `cmd/wasm/grid-containers.go` — `createGridContainer` uses `templ.ToGoHTML`, `calendar.Grid`, `calendar.GridProps`, `calendar.GridContainer`, `calendar.WeekStartAtMonday`. Must use `html/template` instead.
- [ ] `cmd/wasm/grid-containers.go` — `QueryAll` uses `calendar.ClassGridContainer` (hardcode or extract constant)
- [ ] `cmd/wasm/grid-containers.go` — `querySwipeContainer` uses `calendar.IDCalendarSwipe` (hardcode or extract constant)
- [ ] `cmd/wasm/date-picker.go` — uses `appbar.IDDatePickerButton`, `appbar.DatePickerFormat` (hardcode or extract constants)

### WASM features to implement

- [ ] Date picker — Go WASM should handle opening/handling the date picker, not inline JS
- [ ] Theme toggle — Go WASM should handle the dark/light toggle instead of inline JS
- [ ] WASM swipe animation — improve smoothness, consider `requestAnimationFrame`
- [ ] Update date picker button content on swipe (`grid-containers.go:68`, `:71`)
- [ ] Clean up JS in `templates/index.html` — move `openDatePicker()`, `toggleTheme()`, date input listener into Go WASM
- [ ] Register WASM functions via `js.Global().Set(...)` consistently

## CSS / Design

- [x] `public/css/style.css` — rewritten to match `DESIGN.md` color palette, typography, dark/light mode, responsive, and print styles
- [x] Implement theme toggle CSS variables per `DESIGN.md` section 3 (`data-theme` attribute approach)
- [x] Responsive styles per `DESIGN.md` section 10
- [x] Print styles per `DESIGN.md` section 9
- [x] Added `DESIGN_OVERRIDES.md` entries for calendar grid layout and theme toggle icon

## Cleanup

- [ ] Remove unused `internal/handlers/app.go` (its logic moved to `cmd/shift-scheduler/handlers.go`)
- [ ] Remove old templ-generated `*_templ.go` files from `.pages/` and `.components/`
