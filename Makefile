clean:
	git clean -fxd

init:
	npm install

test:
	npx vitest run

check:
	npx tsc && make test

dev:
	MODE=github npx vite --host -c vite.config.js

_vite-build:
	npx vite build --minify -c vite.config.js --emptyOutDir

build:
	make check && \
		MODE=github make _vite-build  && \
		MODE=capacitor make _vite-build && \
		MODE=wails make _vite-build

wails-build:
	cd wails && wails build

wails-build-windows:
	cd wails && wails build -nsis

generate-pwa-assets:
	npx pwa-assets-generator

android-sync:
	npx cap sync android

android-open:
	npx cap open android
