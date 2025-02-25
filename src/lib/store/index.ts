import * as ui from "ui";

import * as types from "../../types";

export type ShiftSchedulerStore = ui.Store<{
    "date-picker": number;
    "week-start": types.calendar.WeekStart;

    settings: {
        shifts: types.settings.Shifts;
        rhythm: types.settings.Rhythm;
        startDate: types.settings.StartDate;
    };

    "edit-mode": types.calendar.EditMode;
}>;

export const prefix = "shift-scheduler:";

export const obj: ShiftSchedulerStore = (() => {
    const store: ShiftSchedulerStore = new ui.Store(prefix);

    const date = new Date();
    store.set("date-picker", new Date(date.getFullYear(), date.getMonth(), 1).getTime(), false);

    store.set("week-start", 0, true);
    store.set("settings", { shifts: [], rhythm: [], startDate: "" }, true);
    store.set("edit-mode", { open: false, active: null }, false);

    return store;
})();
