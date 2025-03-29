clean:
	git clean -fxd

run-debug:
	go run -v --tags debug ./cmd/shift-scheduler

build-android:
	cd cmd/shift-scheduler && fyne package -os android
