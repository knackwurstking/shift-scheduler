import * as ui from "ui";

import db from "./lib/db";
import * as pages from "./pages";

// TODO: Add pwa updater

db.open(() => {
    ui.router.hash.init(document.querySelector(`#routerTarget`)!, {
        "/": {
            title: "Shift Scheduler",
            template: {
                selector: `template[name="calendar"]`,
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
                selector: `template[name="settings"]`,
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
