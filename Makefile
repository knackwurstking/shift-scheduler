.PHONY: all init build run dev docker

GOROOT := `go env GOROOT`

BINARY := shift-scheduler
BIN := ./bin
PUBLIC := ./public

all: build

init:
	@cp "$(GOROOT)/lib/wasm/wasm_exec.js" $(PUBLIC)/
	@go mod tidy

build:
	@GOOS=js GOARCH=wasm go build -o $(PUBLIC)/main.wasm ./cmd/wasm
	@go build -o $(BIN)/$(BINARY) ./cmd/$(BINARY)

run: build
	@./$(BIN)/$(BINARY)

dev: build
	@VERBOSE=true ADDRESS=:3000 ./$(BIN)/$(BINARY)

docker: build
	@docker build --platform linux/arm64 -t shift-scheduler .
