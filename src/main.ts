import * as ui from "ui";

import * as constants from "./constants";
import * as pages from "./pages";

ui.router.hash.init(document.querySelector(constants.routerTarget)!, {
    "/": {
        title: "Shift Scheduler",
        template: {
            selector: constants.templateCalendar,
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
            selector: constants.templateSettings,
            onMount() {
                pages.settings.onMount();
            },
            onDestroy() {
                pages.settings.onDestroy();
            },
        },
    },
});
