import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// TODO: Add icons, and manifest configuration

export default defineConfig({
    plugins: [VitePWA({ registerType: "prompt" })],
});
