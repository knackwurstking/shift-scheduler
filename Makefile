clean:
	git clean -fxd

init:
	npm install

generate-pwa-assets:
	npx pwa-assets-generator

test:
	npx vitest run

check:
	npx tsc && make test

dev:
	MODE=github npx vite --host -c vite.config.js

vite-build:
	npx vite build --minify -c vite.config.js --emptyOutDir

vite-build-all:
	make check && \
		MODE= make vite-build && \
		MODE=github make vite-build  && \
		MODE=capacitor make vite-build && \
		MODE=wails make vite-build

vite-build-github:
	make check && \
		MODE=github make vite-build 

vite-build-capacitor:
	make check && \
		MODE=capacitor make vite-build

vite-build-wails:
	make check && \
		MODE=wails make vite-build 

wails-build:
	cd wails && wails build

wails-build-nsis:
	cd wails && wails build -nsis

android-sync:
	npx cap sync android

android-open:
	npx cap open android
