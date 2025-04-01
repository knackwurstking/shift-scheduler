import "./bootstrap-icons.css";
import "./styles.css";

import { App } from "@capacitor/app";
import * as ui from "ui";
import { registerSW } from "virtual:pwa-register";

import { db } from "@lib";
import * as pages from "@pages";

console.debug("process.env.MODE:", process.env.MODE);

if (process.env.MODE === "capacitor") {
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

if (!process.env.MODE || process.env.MODE === "github") {
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
    ui.router.hash.init({
        "/": {
            title: "Shift Scheduler",
            onMount: () => pages.calendar.onMount(),
            onDestroy: () => pages.calendar.onDestroy(),
        },

        settings: {
            title: "Shift Scheduler | Settings",
            onMount: () => pages.settings.onMount(),
            onDestroy: () => pages.settings.onDestroy(),
        },
    });
});
