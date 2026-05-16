# TODO

Refactor this project: kick a-h templ, move all frontend logic to Go WASM.

## Templ Migration (html/template)

- [x] Create `templates/index.html` using `html/template` syntax
- [x] `cmd/shift-scheduler/templates.go` — `template.Template` via `Parse("templates/*.html")`
- [x] Router wires `tmpls` for `/` route via `handleIndex`
- [x] `cmd/shift-scheduler/handlers.go` — template data types (`IndexTD`, `GridTD`, `GridCellTD`) and handler logic
- [x] Migrate calendar grid and swipe containers from old `.templ` to `index.html`
- [x] WASM grid rendering rewritten — no more templ dependency in WASM
- [x] `internal/handlers/app.go` — removed (no longer wired)
- [x] `go.mod` — removed `github.com/a-h/templ` dependency
- [x] `Makefile` — remove `templ generate` from `init`/`generate` targets, add `dev` target
- [x] Delete old `.templ` backup files in `templates/.pages/` and `templates/.components/`
- [x] Clean up gitignore — remove `*_templ.go` once old files are deleted

## WASM Rework

The WASM binary (`cmd/wasm/`) previously depended on old templ packages. Now uses `strings.Builder` for HTML generation and local constants.

### Completed: Remove templ dependency from WASM

- [x] `cmd/wasm/grid-containers.go` — rewritten, removed templ dependency, uses `createGridHTML` via `strings.Builder`
- [x] `cmd/wasm/grid-containers.go` — local `classGridContainer` constant
- [x] `cmd/wasm/grid-containers.go` — local `idCalendarSwipe` constant
- [x] `cmd/wasm/date-picker.go` — local `idDatePickerButton` and `datePickerFormat` constants
- [x] `cmd/wasm/grid.go` — new file with grid HTML rendering, copied from server handler logic
- [x] `public/css/style.css` — added `.swipe-transition` class for smooth snap-back

### WASM Bugs (fixed)

- [x] **Left swipe broken** — `appendGrid` now removes the first container, `insertGrid` removes the last, keeping exactly 3 containers and showing the correct month

### WASM features to implement

- [x] Date picker — Go WASM handles opening/handling the date picker, not inline JS
- [x] Theme toggle — Go WASM handles the dark/light toggle instead of inline JS
- [ ] **Rework date picker** — replace `input[type=date]` with a modal dialog for month/year selection built in Go WASM
- [ ] WASM swipe animation — improve smoothness, consider `requestAnimationFrame`
- [ ] Update date picker button content on swipe
- [x] Clean up JS in `templates/index.html` — moved `openDatePicker()`, `toggleTheme()`, date input listener into Go WASM
- [x] Register WASM functions via `js.Global().Set(...)` consistently

## CSS / Design

- [x] `public/css/style.css` — rewritten to match `DESIGN.md` color palette, typography, dark/light mode, responsive, and print styles
- [x] Implement theme toggle CSS variables per `DESIGN.md` section 3 (`data-theme` attribute approach)
- [x] Responsive styles per `DESIGN.md` section 10
- [x] Print styles per `DESIGN.md` section 9
- [x] Added `DESIGN_OVERRIDES.md` entries for calendar grid layout and theme toggle icon

## Cleanup

- [x] Remove unused `internal/handlers/app.go` (its logic moved to `cmd/shift-scheduler/handlers.go`)
- [x] Remove old templ-generated `*_templ.go` files from `.pages/` and `.components/`
- [x] `go.mod` cleaned up — no more `a-h/templ`
- [x] `templates/components/` — old templ source files removed
