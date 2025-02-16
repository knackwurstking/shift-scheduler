import * as types from "./types";

export const query = {
    templateSettings: `template[name="settings"]` as types.QuerySelector,
    templateCalendar: `template[name="calendar"]` as types.QuerySelector,

    routerTarget: `#routerTarget` as types.QuerySelector,

    appBar: {
        root: `.ui-app-bar` as types.QuerySelector,
        left: {
            datePicker: `.ui-app-bar .left button.date-picker` as types.QuerySelector,
            backButton: `.ui-app-bar .left .back-button` as types.QuerySelector,
        },
        center: {
            title: `.ui-app-bar .center .title` as types.QuerySelector,
        },
        right: {
            edit: `.ui-app-bar .right button.edit` as types.QuerySelector,
            today: `.ui-app-bar .right button.today` as types.QuerySelector,
            printer: `.ui-app-bar .right button.printer` as types.QuerySelector,
            settings: `.ui-app-bar .right button.settings` as types.QuerySelector,
        },
    },
};
