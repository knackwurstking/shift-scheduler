import * as types from "../../../types";

export const defaultWeekOrder = [0, 1, 2, 3, 4, 5, 6];
export const defaultWeekDaysInOrder = ["Sun", "Mon", "Tue", "Wed", "Thy", "Fri", "Sat"];

export const query = {
    templateCalendarItem: `template[name="calendar-item-content"]` as types.QuerySelector,

    itemContent: `.item-content` as types.QuerySelector,
    weekDay: `.item-content > .week-days > .week-day` as types.QuerySelector,
    day: `.item-content > .days > .day` as types.QuerySelector,
    date: ".date",
    shift: ".shift",
};
