import * as types from "./types";

export const query = {
    templateSettings: `template[name="settings"]` as types.QuerySelector,
    templateCalendar: `template[name="calendar"]` as types.QuerySelector,

    routerTarget: `#routerTarget` as types.QuerySelector,

    appBar: `.ui-app-bar` as types.QuerySelector,
    appBarLeft: {
        backButton: `.ui-app-bar .left .back-button` as types.QuerySelector,
    },
    appBarCenter: {
        title: `.ui-app-bar .center .title` as types.QuerySelector,
    },
    appBarRight: {},
};
