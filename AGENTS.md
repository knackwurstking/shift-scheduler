# AGENTS.md

This file provides essential instructions and guidelines for AI agents working on this repository.

## Build & Development Commands

### Initialization
- `make init`: Performs initial setup, including installing Tailwind CSS dependencies, copying `wasm_exec.js` to the assets directory, and tidying Go modules.

### Building
- `make build`: Compiles both the WebAssembly (WASM) binary and the Go server executable.
  - WASM: `GOOS=js GOARCH=wasm go build -o assets/public/main.wasm ./main.go` 
  - Server: `go build -o bin/shift-scheduler ./cmd/shift-scheduler` 
- `make generate`: Triggers code generation for templates and CSS.
  - Runs `templ generate` to compile `.templ` files into Go code.
  - Runs Tailwind CSS compilation: `npx tailwindcss -i assets/public/css/input.css -o assets/public/css/output.css --minify`

### Development Workflow
After making changes to templates (`.templ`) or CSS (`input.css`), always run:
```bash
make generate
```

## Testing
*Note: Currently, there are no automated tests in this repository.*

If adding tests, use standard Go testing patterns:
- Run all tests: `go test ./...` 
- Run a specific test: `go test -v ./internal/handlers/app_test.go` 

## Code Style & Conventions

### Go (Backend)
- **Structure**: Logic should reside in `internal/` to prevent exposure. The entry point is located in `cmd/shift-template/main.go`.
- **Error Handling**: Follow standard Go error handling patterns (check `err != nil` and return/handle appropriately).
- **Modules**: Ensure `go.mod` is kept up to date using `go mod tidy`.

### Templ (Templating)
- **Templates**: Use `.templ` files located in the `templates/` directory.
- **Generation**: Always run `templ generate` after modifying any `.templ` file to ensure the corresponding `.go` files are updated.
- **Components**: Use composable template components for reusability.

### CSS & Styling (Frontend)
- **Framework**: Tailwind CSS is used for styling.
- **Workflow**: All styles should be defined via Tailwind utility classes in HTML/Templ elements or within `assets/public/css/input.css`.
- **Compilation**: The CSS pipeline is managed via the `Makefile`. Changes to `input.css` require `make generate`.

### WebAssembly (WASM)
- **Integration**: The WASM module (`main.wasm`) is served from `assets/public/`. 
- **Glue Code**: `wasm_exec.js` must be present in the assets directory to support running Go code in the browser.

## Project Structure Overview

- `assets/`: Contains static assets, including compiled WASM and CSS.
  - `assets/public/css/`: Source (`input.css`) and output (`output.css`) for Tailwind.
- `bin/`: Compiled binaries.
- `cmd/shift-scheduler/`: Main application entry point.
- `internal/`: Core application logic and handlers.
- `templates/`: Templ templates (e.g., `layout.templ`, `app.templ`).
- `Makefile`: The primary orchestration tool for builds and generation.
