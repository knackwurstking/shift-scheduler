import * as constants from "../../../constants";
import * as types from "../../../types";

export function isBackupV1(_data: any): boolean {
    // TODO: ...

    return false;
}

// TODO: Add a jest test for isBackupV2
export function isBackupV2(data: any): boolean {
    const isShift = (s: any): boolean => {
        if (!s) return false;

        return !(
            typeof s.id !== "number" ||
            typeof s.name !== "string" ||
            typeof s.shortName !== "string" ||
            typeof s.visible !== "boolean" ||
            (!!s.color && typeof s.color !== "string")
        );
    };

    if (data?.constructor !== Object) {
        return false;
    }

    if (data.settings?.constructor !== Object) {
        return false;
    }

    if (data.indexedDB?.constructor !== Object) {
        return false;
    }

    // Check settings
    if (
        !Array.isArray(data.settings.shifts) ||
        !Array.isArray(data.settings.rhythm) ||
        typeof data.settings.startDate !== "string"
    ) {
        return false;
    }

    if (!!data.settings.rhythm.find((r: any) => typeof r !== "number")) {
        return false;
    }

    if (!!data.settings.shifts.find((s: any) => !isShift(s))) {
        return false;
    }

    // Check indexedDB
    if (typeof data.indexedDB.version !== "number" || !Array.isArray(data.indexedDB.data)) {
        return false;
    }

    if (
        !!data.indexedDB.data.find((entry: any) => {
            if (
                typeof entry.year !== "number" ||
                typeof entry.month !== "number" ||
                typeof entry.date !== "number" ||
                (entry.shift !== null && entry.shift?.constructor !== Object) ||
                typeof entry.note !== "string"
            ) {
                return true;
            }

            if (!isShift(entry.shift) && entry.shift !== null) {
                return true;
            }

            return false;
        })
    ) {
        return false;
    }

    return true;
}

// Ok, this really is ugly, butt it works for now
export function isBackupV3(data: any): boolean {
    const isShift = (s: any): boolean => {
        if (!s) return false;

        return !(
            typeof s.id !== "number" ||
            typeof s.name !== "string" ||
            typeof s.shortName !== "string" ||
            typeof s.visible !== "boolean" ||
            (!!s.color && typeof s.color !== "string")
        );
    };

    if (data?.constructor !== Object) {
        return false;
    }

    if (typeof data.weekStart !== "number") {
        return false;
    }

    if (data.settings?.constructor !== Object) {
        return false;
    }

    if (data.version?.constructor !== Object) {
        return false;
    }

    if (data.indexedDB?.constructor !== Object) {
        return false;
    }

    // Check settings
    if (
        !Array.isArray(data.settings.shifts) ||
        !Array.isArray(data.settings.rhythm) ||
        typeof data.settings.startDate !== "number"
    ) {
        return false;
    }

    if (!!data.settings.rhythm.find((r: any) => typeof r !== "number")) {
        return false;
    }

    if (!!data.settings.shifts.find((s: any) => !isShift(s))) {
        return false;
    }

    // Check version
    if (typeof data.version.version !== "string" || typeof data.version.build !== "number") {
        return false;
    }

    // Check indexedDB
    if (typeof data.indexedDB.version !== "number" || !Array.isArray(data.indexedDB.data)) {
        return false;
    }

    if (
        !!data.indexedDB.data.find((entry: any) => {
            if (
                typeof entry.year !== "number" ||
                typeof entry.month !== "number" ||
                typeof entry.date !== "number" ||
                (entry.shift !== null && entry.shift?.constructor !== Object) ||
                typeof entry.note !== "string"
            ) {
                return true;
            }

            if (!isShift(entry.shift) && entry.shift !== null) {
                return true;
            }

            return false;
        })
    ) {
        return false;
    }

    return true;
}

export function convertV2(data: types.settings.BackupV2): types.settings.BackupV3 {
    return {
        weekStart: 0,
        version: {
            version: constants.version,
            build: constants.build,
        },
        settings: {
            rhythm: data.settings.rhythm,
            shifts: data.settings.shifts,
            startDate: new Date(data.settings.startDate).getTime(),
        },
        indexedDB: {
            version: data.indexedDB.version,
            data: data.indexedDB.data.map((entry) => ({
                year: entry.year,
                month: entry.month,
                date: entry.date,
                shift: entry.shift || null,
                note: entry.note,
            })),
        },
    };
}

//export function convertV1(data: types.settings.BackupV1): types.settings.BackupV3 {
//    // TODO: ...
//
//    return {};
//}
