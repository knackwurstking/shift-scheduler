import * as ui from "ui";

import * as types from "../../types";

export type ShiftSchedulerStore = ui.Store<{
    "date-picker": number;
    "week-start": types.calendar.WeekStart;

    settings: {
        // TODO: Move one level down, remove "settings" from the store
        shifts: types.settings.Shifts;
        rhythm: types.settings.Rhythm;
        startDate: types.settings.StartDate;
    };

    version: {
        version: string;
        build: number;
    };

    "edit-mode": types.calendar.EditMode;
}>;

export const prefix = "shift-scheduler:";

export const obj: ShiftSchedulerStore = (() => {
    const store: ShiftSchedulerStore = new ui.Store(prefix);

    const date = new Date();
    store.set("date-picker", new Date(date.getFullYear(), date.getMonth(), 1).getTime(), false);

    store.set("week-start", 0, true);
    store.set("settings", { shifts: [], rhythm: [], startDate: 0 }, true);
    store.set("edit-mode", { open: false, active: null }, false);

    const newVersion = { version: "0.0.0", build: 1 };

    switch (store.get("version")?.build) {
        case undefined:
            const oldStartDate = store.get("settings")?.startDate;
            if (oldStartDate) {
                // NOTE: Start date in settings changed from string to number in version v3.0.0
                store.update("settings", (settings) => {
                    settings.startDate = new Date(oldStartDate).getTime();
                    return settings;
                });

                // TODO: "settings" removed from the store
            }
            break;
    }

    store.set("version", newVersion);

    return store;
})();
