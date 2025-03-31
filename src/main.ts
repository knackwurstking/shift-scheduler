import "./bootstrap-icons.css";

import { App } from "@capacitor/app";
import * as ui from "ui";
import { registerSW } from "virtual:pwa-register";

import { db } from "@lib";
import * as pages from "@pages";

// TODO: Add Paraglide JS for translations (de, en)

if (process.env.MODE === "android") {
    App.addListener("backButton", ({ canGoBack }) => {
        if (!!document.querySelector(`dialog[open]`)) {
            return;
        }

        if (!canGoBack) {
            App.exitApp();
        } else {
            window.history.back();
        }
    });
}

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
