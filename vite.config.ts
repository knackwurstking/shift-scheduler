import { defineConfig } from "vite";
import { IconResource, ManifestOptions, VitePWA } from "vite-plugin-pwa";

const icons: IconResource[] = [
    {
        src: "assets/icons/pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
    },
    {
        src: "assets/icons/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
    },
    {
        src: "assets/icons/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
    },
    {
        src: "assets/icons/maskable-icon-512x512.png",
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

let base = "/shift-scheduler.github.io/";
let outDir = "../shift-scheduler.github.io/";
if (process.env.MODE === "android") {
    base = "/";
    outDir = "./android-dist/";
}

export default defineConfig({
    plugins: [
        VitePWA({
            strategies: "generateSW",
            registerType: "prompt",
            includeAssets: [
                "assets/fonts/bootstrap-icons.woff",
                "assets/fonts/bootstrap-icons.woff2",
            ],
            manifest,
        }),
    ],
    clearScreen: false,
    base,

    build: {
        outDir,
    },

    define: {
        "process.env.MODE": "pwa",
    },
});
