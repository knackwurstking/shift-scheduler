import * as ui from "ui";

import db from "./lib/db";
import * as pages from "./pages";

// TODO: Add pwa updater

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
