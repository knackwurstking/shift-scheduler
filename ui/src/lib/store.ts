import * as ui from "ui";

import {
    EditMode,
    Rhythm,
    Shifts,
    StartDate,
    Version,
    WeekStart,
} from "@types";
import * as constants from "./constants";

export type ShiftSchedulerStore = ui.Store<{
    datePicker: number;

    weekStart: WeekStart;

    shifts: Shifts;
    rhythm: Rhythm;
    startDate: StartDate;

    version: Version;

    editMode: EditMode;

    update: {
        updateSW: (reloadPage?: boolean) => Promise<void>;
    };
}>;

export const prefix = "shift-scheduler:";

export const obj: ShiftSchedulerStore = (() => {
    const store: ShiftSchedulerStore = new ui.Store(prefix);

    const date = new Date();
    store.set(
        "datePicker",
        new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
        false,
    );

    store.set("weekStart", 0, true);

    store.set("shifts", [], true);
    store.set("rhythm", [], true);
    store.set("startDate", 0, true);

    store.set(
        "editMode",
        { open: false, active: constants.shiftIDNothing },
        false,
    );

    const newVersion = { version: constants.version, build: constants.build };

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
