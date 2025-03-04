clean:
	@git clean -fxd

dev:
	@npm run dev

build:
	@npm run check && \
        npm run build

generate-assets:
	@npx pwa-assets-generator

pwa-init:
	@npx bubblewrap init --manifest=https://knackwurstking.github.io/shift-scheduler.github.io/manifest.webmanifest

pwa-build:
	@npx bubblewrap build
