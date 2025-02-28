import * as ui from "ui";
import { registerSW } from "virtual:pwa-register";

import db from "./lib/db";
import * as pages from "./pages";

// Add PWA updater
const updateSW = registerSW({
    async onNeedRefresh() {
        if (confirm(`Update verfügbar. Zum Aktualisieren bestätigen.`)) {
            await updateSW();
        }
    },
});

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
