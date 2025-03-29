import "./bootstrap-icons.css";

import * as ui from "ui";
import { registerSW } from "virtual:pwa-register";

import { db } from "@globals";
import * as pages from "@pages";

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
