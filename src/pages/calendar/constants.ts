import * as types from "../../types";

export const query = {
    templateCalendarItem: `template[name="calendar-item"]` as types.QuerySelector,

    itemContainer: `.item-container` as types.QuerySelector,
    editMode: `.edit-mode` as types.QuerySelector,
};
