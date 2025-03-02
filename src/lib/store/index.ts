import * as ui from "ui";

import * as types from "../../types";

export type ShiftSchedulerStore = ui.Store<{
    datePicker: number;

    weekStart: types.calendar.WeekStart;

    shifts: types.calendar.Shifts;
    rhythm: types.calendar.Rhythm;
    startDate: types.calendar.StartDate;

    version: types.Version;

    editMode: types.calendar.EditMode;
}>;

export const prefix = "shift-scheduler:";

export const obj: ShiftSchedulerStore = (() => {
    const store: ShiftSchedulerStore = new ui.Store(prefix);

    const date = new Date();
    store.set("datePicker", new Date(date.getFullYear(), date.getMonth(), 1).getTime(), false);

    store.set("weekStart", 0, true);

    store.set("shifts", [], true);
    store.set("rhythm", [], true);
    store.set("startDate", 0, true);

    store.set("editMode", { open: false, active: null }, false);

    const newVersion = { version: "0.0.0", build: 1 };

    switch (store.get("version")?.build) {
        case undefined:
            const oldStartDate = store.get("startDate");
            if (!!oldStartDate) {
                // NOTE: Start date in settings changed from string to number in version v3.0.0
                store.set("startDate", new Date(oldStartDate).getTime());
            }
            break;
    }

    store.set("version", newVersion);

    return store;
})();
