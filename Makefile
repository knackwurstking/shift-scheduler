.PHONY: all install-tailwind init generate build

GOROOT := `go env GOROOT`

BINARY := base-ah-templ
BIN := ./bin
ASSETS := ./assets/public

all: init build

install-tailwind:
	@test -f package.json || npm init -y
	@npm install --save-dev tailwindcss postcss autoprefixer @tailwindcss/typography
	@make generate

init: install-tailwind
	@cp "$(GOROOT)/lib/wasm/wasm_exec.js" $(ASSETS)/
	@go mod tidy

generate:
	@templ generate
	@npx tailwindcss -i $(ASSETS)/css/input.css -o $(ASSETS)/css/output.css --minify

build:
	@GOOS=js GOARCH=wasm go build -o $(ASSETS)/main.wasm ./main.go
	@go build -o $(BIN)/$(BINARY) ./cmd/$(BINARY)

