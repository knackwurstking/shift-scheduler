# Changelog

## v1.5.1 2024-02-07

- Change android share titles for backup and pdf exports
- Some code clean up

## v1.5.0 2024-02-05

- Changed backup settings: import/export buttons
- Upgrade `svelte-css` version to "v0.7.0"

## v1.4.1 2023-01-26

- Added metadata full_description (for f-droid upload)
- Added some new screenshots

## v1.4.0 2023-12-10

- New settings section: Backup (replacing storage backup)
- Code clean up: `js/lang`
- Code clean up: `jsdoc` types

__*NOTE*__:
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

- New "pdf" view for preview a whole year and dowload as pdf

### Fixed

- Code clean up

### Changed

- Version for `svelte-css`: v0.6.0

## v1.2.0 2023-11-08

### Added

- "Fira Sans" and "Fira Mono" fonts

### Changed

- `svelte-css` version v0.5.0
- some style changes
- input components for types "date" and "month"
- calendar items font size (".date" and ".shiftName")
- shifts color highlighting (".background" removed)
- remove color table section from settings shifts

### Fixed

- collapse select component on day dialog close

## v1.1.0 2023-11-06

### Added

- new components for html text and number input
- new component for html select
- add wails (v2.6.0) for Linux/Windows desktop builds

### Changed

- `svelte-css` version v0.4.2

### Fixed

- calendar swipe (no swipe)
