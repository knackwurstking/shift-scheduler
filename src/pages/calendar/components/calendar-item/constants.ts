import * as types from "../../../../types";

export const query = {
    templateCalendarItem: `template[name="calendar-item"]` as types.QuerySelector,

    itemContent: `.item-content` as types.QuerySelector,
    weekDays: `.item-content > .weekDays` as types.QuerySelector,

    dayItem: `.item-content > .days > .day` as types.QuerySelector,
};
