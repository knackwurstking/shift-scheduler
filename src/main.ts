import * as ui from "ui";

import * as constants from "./constants";
import * as pages from "./pages";
import db from "./db";

db.open(() => {
    ui.router.hash.init(document.querySelector(constants.query.routerTarget)!, {
        "/": {
            title: "Shift Scheduler",
            template: {
                selector: constants.query.templateCalendar,
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
                selector: constants.query.templateSettings,
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
