PWA_URL=https://knackwurstking.github.io/shift-scheduler.github.io

clean:
	git clean -fxd

init:
	npm install

dev:
	npm run dev

build:
	npm run check && npm run build:pwa && npm run build:android

generate-assets:
	npx pwa-assets-generator

pwa-init:
	npx bubblewrap init --manifest=${PWA_URL}/manifest.webmanifest

pwa-build:
	npx bubblewrap build

android-sync:
	npx cap sync android

android-build:
	npx cap build android

android-run:
	npx cap build android

android-open:
	npx cap open android
