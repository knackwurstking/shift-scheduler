export function isBackupV1(_data: any): boolean {
    // TODO: ...

    return false;
}

export function isBackupV2(_data: any): boolean {
    // TODO: ...

    return false;
}

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

//export function convertV2(data: types.settings.BackupV2): types.settings.BackupV3 {
//    // TODO: ...
//
//    return {};
//}
//
//export function convertV1(data: types.settings.BackupV1): types.settings.BackupV3 {
//    // TODO: ...
//
//    return {};
//}
