import * as constants from "../../constants";
import * as types from "../../types";

export const query = {
    templateCalendarItem: `template[name="calendar-item"]` as types.QuerySelector,

    itemContainer: `.item-container` as types.QuerySelector,
    editMode: `.edit-mode` as types.QuerySelector,

    appBar: constants.query.appBar,
    appBarLeft: constants.query.appBarLeft,
    appBarCenter: constants.query.appBarCenter,
    appBarRight: constants.query.appBarRight,
};
