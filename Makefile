.PHONY: all init generate build run docker

GOROOT := `go env GOROOT`

BINARY := shift-scheduler
BIN := ./bin
ASSETS := ./assets/public

all: init build

init: generate
	@cp "$(GOROOT)/lib/wasm/wasm_exec.js" $(ASSETS)/
	@go mod tidy

generate:
	@templ generate

build:
	@GOOS=js GOARCH=wasm go build -o $(ASSETS)/main.wasm ./cmd/wasm
	@go build -o $(BIN)/$(BINARY) ./cmd/$(BINARY)

run: init build
	@./$(BIN)/$(BINARY)

docker: init build
	@docker build --platform linux/arm64 -t file-server .
