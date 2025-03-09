import { constants } from "@globals";
import * as types from "@types";

export function isBackupV1(data: any): boolean {
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

    if (data.storage?.constructor !== Object) {
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

    // Check storage
    for (const k in data.storage) {
        if (typeof k !== "string") {
            return false;
        }

        if (data.storage[k]?.constructor !== Object) {
            return false;
        }

        for (const k2 in data.storage[k]) {
            if (typeof k2 !== "string") {
                return false;
            }

            const e = data.storage[k][k2];

            if (e?.constructor !== Object) {
                return false;
            }

            if (!isShift(e.shift) && e.shift !== null) {
                return false;
            }

            if (typeof e.note !== "string") {
                return false;
            }
        }
    }

    return true;
}

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

    if (data.version?.constructor !== Object) {
        return false;
    }

    if (data.indexedDB?.constructor !== Object) {
        return false;
    }

    if (
        !Array.isArray(data.shifts) ||
        !Array.isArray(data.rhythm) ||
        typeof data.startDate !== "number"
    ) {
        return false;
    }

    if (!!data.rhythm.find((r: any) => typeof r !== "number")) {
        return false;
    }

    if (!!data.shifts.find((s: any) => !isShift(s))) {
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

export function convertV2(data: types.backup.BackupV2): types.backup.BackupV3 {
    return {
        weekStart: 0,
        version: {
            version: constants.version,
            build: constants.build,
        },
        rhythm: data.settings.rhythm,
        shifts: data.settings.shifts,
        startDate: !!data.settings.startDate ? new Date(data.settings.startDate).getTime() : 0,
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

export function convertV1(data: types.backup.BackupV1): types.backup.BackupV3 {
    return {
        weekStart: 0,
        version: {
            version: constants.version,
            build: constants.build,
        },
        rhythm: data.settings.rhythm,
        shifts: data.settings.shifts,
        startDate: !!data.settings.startDate ? new Date(data.settings.startDate).getTime() : 0,
        indexedDB: convertV1StorageToV3IndexedDB(data),
    };
}

function convertV1StorageToV3IndexedDB(data: types.backup.BackupV1): {
    version: number;
    data: types.db.Entry[];
} {
    const result: { version: number; data: types.db.Entry[] } = {
        version: 1,
        data: [],
    };

    const parse = (data: {
        [key: string]: {
            shift: {
                id: number;
                name: string;
                shortName: string;
                visible: boolean;
                color?: string | null;
            } | null;
            note: string;
        };
    }): void => {
        for (const [k, v] of Object.entries(data)) {
            const [y, m, d] = k.split("-", 3).map((n) => parseInt(n, 10));

            if (isNaN(y) || isNaN(m) || isNaN(d)) {
                continue;
            }

            if (m < 0 || m > 11) {
                continue;
            }

            if (!("shift" in v) || !("note" in v)) {
                continue;
            }

            result.data.push({
                year: y,
                month: m,
                date: d,
                shift: v.shift,
                note: v.note,
            });
        }
    };

    // Validate data and convert to new indexedDB data
    Object.values(data.storage).forEach((v) => parse(v));

    return result;
}
