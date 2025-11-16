all: init build-capacitor android-sync

clean:
	git clean -fxd

init:
	npm ci && \
		npx paraglide-js compile \
			--project ./project.inlang \
			--outdir ./src/paraglide \
			--strategy preferredLanguage baseLocale

generate-pwa-assets:
	npx pwa-assets-generator

test:
	#npx tsc && npx vitest run
	@echo "\033[31mThis is broken now: SecurityError: Cannot initialize local storage without a --localstorage-file path\033[0m"

dev:
	MODE= npx vite --host -c vite.config.js

preview:
	make build-web
	MODE= npx vite preview --host

build:
	npx vite build --minify -c vite.config.js --emptyOutDir

build-web:
	make test && \
		MODE= make build

build-capacitor:
	make test && \
		MODE=capacitor make build

android-sync:
	npx cap sync android
	@echo '--> Open Android Studio with `make android-open`'

android-open:
	npx cap open android
