import * as ui from "ui";

import * as types from "../types";

export const prefix = "shift-scheduler:";

export const obj = new ui.Store<types.store.Data>(prefix);
init();

function init() {
    const date = new Date();

    obj.set("date-picker", new Date(date.getFullYear(), date.getMonth(), 1).getTime(), false);
    obj.set("week-start", 0, true);
    obj.set("settings", { shifts: [], rhythm: [], startDate: "" }, true);
    obj.set("edit-mode", { open: false, active: null }, false);
}
