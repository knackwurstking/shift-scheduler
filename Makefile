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
	MODE= npx vite --host -c vite.config.js

vite-build:
	npx vite build --minify -c vite.config.js --emptyOutDir

vite-build-capacitor:
	make check && \
		MODE=capacitor make vite-build

vite-build-all:
	make check && \
		MODE= make vite-build && \
		MODE=capacitor make vite-build

android-sync:
	npx cap sync android

android-open:
	npx cap open android
