PWA_URL=https://knackwurstking.github.io/shift-scheduler.github.io

clean:
	git clean -fxd

init:
	npm install

dev:
	npm run dev

build:
	npm run check && npm run build:github && npm run build:android

generate-assets:
	npx pwa-assets-generator

android-sync:
	npx cap sync android

android-open:
	npx cap open android
