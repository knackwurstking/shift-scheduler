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
    short_name: "Shift Scheduler",
    icons: icons,
    screenshots: [],
    theme_color: "#000000",
    background_color: "#000000",
    display: "standalone",
    scope: ".",
    publicPath: process.env.SERVER_PATH_PREFIX,
};

export default defineConfig({
    plugins: [
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/paraglide",
            strategy: ["preferredLanguage", "baseLocale"],
        }),
        tsconfigPaths(),
        VitePWA({
            strategies: "generateSW",
            registerType: "prompt",
            includeAssets: [
                "assets/fonts/bootstrap-icons.woff",
                "assets/fonts/bootstrap-icons.woff2",
                "assets/icons/apple-touch-icon-180x180.png",
                "assets/icons/favicon.ico",
                "assets/icons/icon.svg",
            ],
            manifest,
        }),
    ],
    clearScreen: false,
    base: process.env.SERVER_PATH_PREFIX,

    preview: {
        port: 9030, // NOTE: This is the port i use in my rpi-server-project
    },

    build: {
        outDir:
            process.env.MODE === "capacitor" ? "./dist-capacitor" : "./dist",
    },

    define: {
        /**
         * Available modes: "capacitor" | ""
         */
        "process.env.MODE": JSON.stringify(process.env.MODE),
    },
});
