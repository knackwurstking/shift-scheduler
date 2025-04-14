import * as ui from "ui";

import { build, shiftIDNothing, version } from "./constants";
import {
    EditMode,
    Rhythm,
    Shifts,
    StartDate,
    Version,
    WeekStart,
} from "./types.store";
import { backupUtils } from "@lib";

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

    store.set("editMode", { open: false, active: shiftIDNothing }, false);

    const newVersion = { version: version, build: build };

    // There is more to fix here after updating from v2 to v3
    switch (store.get("version")?.build) {
        // If build is undefined: old version detected, do migrade to v2
        case undefined:
            // Check backup utils and migrate all data to v3
            migrateStorageToV3(store);
            break;
    }

    store.set("version", newVersion);

    return store;
})();

function migrateStorageToV3(store: ShiftSchedulerStore) {
    const storePrefix = "shift-scheduler:";
    const settingsStore = localStorage.getItem(storePrefix + "settings");
    if (settingsStore) {
        const settings = JSON.parse(settingsStore);

        if (
            Array.isArray(settings.shifts) &&
            settings.shifts.find((s: any) =>
                backupUtils.isShiftForBackupV1orV2(s),
            )
        ) {
            store.set("shifts", settings.shifts);
        } else {
            console.warn(
                "Old `settings.shifts` storage data are incompatible with v3!",
                settings.shifts,
            );
        }

        if (
            Array.isArray(settings.rhythm) &&
            settings.rhythm.find((n: any) => typeof n === "number")
        ) {
            store.set("rhythm", settings.rhythm);
        } else {
            console.warn(
                "Old `settings.rhythm` storage data are incompatible with v3!",
                settings.rhythm,
            );
        }

        if (typeof settings.startDate === "string") {
            store.set("startDate", new Date(settings.startDate).getTime());
        } else {
            console.warn(
                "Old `settings.dataPicker` storage data are incompatible with v3!",
                settings.rhythm,
            );
        }
    }

    const weekStartStore = localStorage.getItem(storePrefix + "week-start");
    if (weekStartStore) {
        const weekStart = parseInt(weekStartStore, 10);
        if (weekStart === 0 || weekStart === 1) {
            store.set("weekStart", weekStart);
        }
    }

    const datePickerStore = localStorage.getItem(storePrefix + "date-picker");
    if (datePickerStore) {
        const datePicker = new Date(datePickerStore);
        store.set(
            "datePicker",
            datePicker.getTime() || store.get("weekStart")!,
        );
    }
}
