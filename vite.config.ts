import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "vite";
import { IconResource, ManifestOptions, VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

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
    screenshots: [],
    theme_color: "#09090b",
    background_color: "#09090b",
    display: "standalone",
    scope: ".",
    start_url: "./",
    publicPath: "/shift-scheduler.github.io",
};

export default defineConfig({
    plugins: [
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/paraglide",
        }),
        tsconfigPaths(),
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
    base: process.env.MODE === "github" ? "/shift-scheduler.github.io/" : "/",

    build: {
        outDir:
            process.env.MODE === "github"
                ? "../shift-scheduler.github.io/"
                : "./dist",
    },

    define: {
        "process.env.PWA": process.env.PWA || false,

        /**
         * Available modes: "android", "github"
         * The "android" mode will enable all capacitor stuff
         */
        "process.env.MODE": JSON.stringify(process.env.MODE),
    },
});
