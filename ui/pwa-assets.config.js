import { defineConfig, minimal2023Preset as preset } from "@vite-pwa/assets-generator/config";

preset.transparent.padding = 0;
preset.apple.padding = 0;
preset.maskable.padding = 0;

export default defineConfig({
    preset,
    images: ["public/icons/icon.svg"],
});
