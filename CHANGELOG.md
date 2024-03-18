# Changelog

## v1.6.0 [unreleased]

- [x] Add separator line with text "Edit Mode" if toggled on
- [x] Slide in and out the edit mode footer
- [x] Calendar view height transition css prop
- ~~[ ] Save current month to the local storage~~
- [ ] Slide in and out all dialogs
- ~~[ ] Slide in views (like settings) from right to left, and slide if removed from stack~~
- [ ] Change the app icon

## v1.5.2 2024-03-02

- Changed ui library from `svelte-css` to [ui v0.1.0](https://github.com/knackwurstking/ui.git)

## v1.5.1 2024-02-07

- Change Android share titles for backup and PDF exports
- Code clean up

## v1.5.0 2024-02-05

- Changed backup settings: import/export buttons
- Upgrade `svelte-css` version to "v0.7.0"

## v1.4.1 2023-01-26

- Added metadata full_description (for f-droid upload)
- Added some new screenshots

## v1.4.0 2023-12-10

- Added backup section to settings view (the old storage backup part removed)
- Code clean up: `js/lang`
- Code clean up: `jsdoc` types

**_NOTE_**:

- Old storage backup files will no longer work with this version

## v1.3.1 2023-12-06

### Added

- Calendar reload on an app resume event

### Changed

- Update `svelte-css` from v0.6.0 to v0.6.1
- Rename storage backup description (upload/download => import/export)

### Fixed

- Code clean up: settings view
- Sort settings storage table entries, years and months from low to high
- TopAppBar (css) styles

## v1.3.0 2023-11-26

### Added

- New "pdf" view for preview a whole year and download as pdf

### Fixed

- Code clean up

### Changed

- Version for `svelte-css`: v0.6.0

## v1.2.0 2023-11-08

### Added

- "Fira Sans" and "Fira Mono" fonts

### Changed

- `svelte-css` version v0.5.0
- Some style changes
- Input components for types "date" and "month"
- Calendar items font size (".date" and ".shiftName")
- Shifts color highlighting (".background" removed)
- Remove the color table section from settings shifts

### Fixed

- Collapse select component on day dialog close

## v1.1.0 2023-11-06

### Added

- Replaced components for HTML text and number input
- Replaced component(s) for html select
- Added wails (v2.6.0) for Linux/Windows desktop builds

### Changed

- `svelte-css` version v0.4.2

### Fixed

- Calendar swipe (no swipe)
