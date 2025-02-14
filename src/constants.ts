import * as types from "./types";

export const query = {
    templateSettings: `template[name="settings"]` as types.QuerySelector,
    templateCalendar: `template[name="calendar"]` as types.QuerySelector,
    routerTarget: `#routerTarget` as types.QuerySelector,
};
