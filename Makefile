PWA_URL=https://knackwurstking.github.io/shift-scheduler.github.io

clean:
	git clean -fxd

init:
	npm install

dev:
	npm run dev

build:
	npm run check && npm run build

generate-assets:
	npx pwa-assets-generator

pwa-init:
	npx bubblewrap init --manifest=${PWA_URL}/manifest.webmanifest

pwa-build:
	npx bubblewrap build

cap-android-build:
	npx cap sync && npx cap build android

cap-android-run:
	npx cap run android
