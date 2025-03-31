import "./bootstrap-icons.css";

import * as ui from "ui";
import { registerSW } from "virtual:pwa-register";
import { App } from "@capacitor/app";

import { db } from "@lib";
import * as pages from "@pages";

if (process.env.MODE === "android") {
    // FIXME: Block back button if dialog is open?
    App.addListener("backButton", ({ canGoBack }) => {
        if (!canGoBack) {
            App.exitApp();
        } else {
            window.history.back();
        }
    });
}

console.debug({ PWA: process.env.PWA, MODE: process.env.MODE });
if (process.env.PWA) {
    console.debug("PWA updater registered");
    const updateSW = registerSW({
        async onNeedRefresh() {
            if (confirm(`Update verfügbar. Zum Aktualisieren bestätigen.`)) {
                await updateSW();
            }
        },
    });
}

db.open(() => {
    ui.router.hash.init(null, {
        "/": {
            title: "Shift Scheduler",
            template: {
                onMount() {
                    pages.calendar.onMount();
                },
                onDestroy() {
                    pages.calendar.onDestroy();
                },
            },
        },

        settings: {
            title: "Shift Scheduler | Settings",
            template: {
                onMount() {
                    pages.settings.onMount();
                },
                onDestroy() {
                    pages.settings.onDestroy();
                },
            },
        },
    });
});
