import { defineConfig } from "vite";
import { IconResource, ManifestOptions, VitePWA } from "vite-plugin-pwa";

const icons: IconResource[] = [
    {
        src: "/icons/pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
    },
    {
        src: "/icons/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
    },
    {
        src: "/icons/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
    },
    {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
    },
];

const manifest: Partial<ManifestOptions> = {
    name: "Schift Scheduler",
    short_name: "shift-scheduler",
    icons: icons,
    screenshots: [
        // TODO: ...
    ],
    theme_color: "#09090b",
    background_color: "#09090b",
    display: "standalone",
    scope: ".",
    start_url: "./",
    publicPath: "/shift-scheduler.github.io",
};

export default defineConfig({
    plugins: [
        VitePWA({
            strategies: "generateSW",
            registerType: "prompt",
            manifest,
        }),
    ],
    clearScreen: false,
    base: "/shift-scheduler.github.io/",

    build: {
        outDir: "../shift-scheduler.github.io/",
    },
});
