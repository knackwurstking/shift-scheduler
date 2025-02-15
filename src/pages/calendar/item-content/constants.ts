import * as types from "../../../types";

export const query = {
    templateCalendarItem: `template[name="calendar-item-content"]` as types.QuerySelector,

    itemContent: `.item-content` as types.QuerySelector,
    weekDay: `.item-content > .week-day` as types.QuerySelector,
    day: `.item-content > .days > .day` as types.QuerySelector,
    date: ".date",
    shift: ".shift",
};
