clean:
	git clean -fxd

run-debug:
	go run -v --tags debug ./cmd/shift-scheduler
