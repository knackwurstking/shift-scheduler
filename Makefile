clean:
	git clean -fxd

run:
	go run -v ./cmd/shift-scheduler

run-debug:
	go run -v --tags debug ./cmd/shift-scheduler

build-android:
	cd cmd/shift-scheduler && fyne package --os android

build-debug-android:
	cd cmd/shift-scheduler && fyne package --os android --tags debug
