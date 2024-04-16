import { defineConfig } from "vite";
//import mkcert from "vite-plugin-mkcert";
//import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        //mkcert(),
        //VitePWA({
        //    registerType: "autoUpdate",
        //    devOptions: {
        //        enabled: true,
        //    },
        //    manifest: {
        //        theme_color: "#000000",
        //        icons: [
        //            {
        //                sizes: "48x48",
        //                src: "/images/maskable_icon_x48.png",
        //                type: "image/png",
        //                purpose: "maskable",
        //            },
        //            {
        //                sizes: "72x72",
        //                src: "/images/maskable_icon_x72.png",
        //                type: "image/png",
        //                purpose: "maskable",
        //            },
        //            {
        //                sizes: "96x96",
        //                src: "/images/maskable_icon_x96.png",
        //                type: "image/png",
        //                purpose: "maskable",
        //            },
        //            {
        //                sizes: "128x128",
        //                src: "/images/maskable_icon_x128.png",
        //                type: "image/png",
        //                purpose: "maskable",
        //            },
        //            {
        //                sizes: "144x144",
        //                src: "/images/maskable_icon_x144.png",
        //                type: "image/png",
        //                purpose: "maskable any",
        //            },
        //            {
        //                sizes: "192x192",
        //                src: "/images/maskable_icon_x192.png",
        //                type: "image/png",
        //                purpose: "maskable",
        //            },
        //            {
        //                sizes: "384x384",
        //                src: "/images/maskable_icon_x384.png",
        //                type: "image/png",
        //                purpose: "maskable",
        //            },
        //            {
        //                sizes: "512x512",
        //                src: "/images/maskable_icon_x512.png",
        //                type: "image/png",
        //                purpose: "maskable",
        //            },
        //        ],
        //    },
        //}),
    ],
    clearScreen: false,
});
