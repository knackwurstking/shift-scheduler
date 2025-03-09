import { describe, expect, test } from "@jest/globals";

import { constants } from "../../../globals";
import { BackupV1, BackupV2, BackupV3 } from "../../../types/backup";

import { convertV1, convertV2, isBackupV1, isBackupV2, isBackupV3 } from "./backup-utils";

describe("pages -> settings -> backup-utils", () => {
    test("isBackupV3", () => {
        expect(isBackupV3({})).toBe(false);
        expect(isBackupV3(null)).toBe(false);
        expect(isBackupV3([])).toBe(false);

        let data: BackupV3 = {
            weekStart: 0,
            shifts: [],
            rhythm: [],
            startDate: 0,
            version: {
                version: constants.version,
                build: constants.build,
            },
            indexedDB: {
                version: 0,
                data: [],
            },
        };
        expect(isBackupV3(data)).toBe(true);

        data.shifts.push({
            id: new Date().getTime(),
            name: "Name",
            shortName: "Short",
            visible: true,
        });
        expect(isBackupV3(data)).toBe(true);

        data.shifts[0].color = "#ffffff";
        expect(isBackupV3(data)).toBe(true);

        data.shifts[0].color = null;
        expect(isBackupV3(data)).toBe(true);

        data.rhythm.push(0, 1, 2);
        expect(isBackupV3(data)).toBe(true);

        data.indexedDB.data.push({
            year: 2025,
            month: 2,
            date: 13,
            shift: null,
            note: "",
        });
        expect(isBackupV3(data)).toBe(true);

        data.indexedDB.data[0].shift = data.shifts[0];
        expect(isBackupV3(data)).toBe(true);
    });
});

describe("pages -> settings -> backup-utils", () => {
    test("isBackupV2", () => {
        expect(isBackupV2({})).toBe(false);
        expect(isBackupV2(null)).toBe(false);
        expect(isBackupV2([])).toBe(false);

        let data: BackupV2 = {
            settings: {
                shifts: [],
                rhythm: [],
                startDate: "",
            },
            indexedDB: {
                version: 0,
                data: [],
            },
        };
        expect(isBackupV2(data)).toBe(true);

        data.settings.shifts.push({
            id: new Date().getTime(),
            name: "Name",
            shortName: "Short",
            visible: true,
        });
        expect(isBackupV2(data)).toBe(true);

        data.settings.shifts[0].color = "#ffffff";
        expect(isBackupV2(data)).toBe(true);

        data.settings.shifts[0].color = null;
        expect(isBackupV2(data)).toBe(true);

        data.settings.rhythm.push(0, 1, 2);
        expect(isBackupV2(data)).toBe(true);

        data.indexedDB.data.push({
            year: 2025,
            month: 2,
            date: 13,
            shift: null,
            note: "",
        });
        expect(isBackupV2(data)).toBe(true);

        data.indexedDB.data[0].shift = data.settings.shifts[0];
        expect(isBackupV2(data)).toBe(true);
    });
});

describe("pages -> settings -> backup-utils", () => {
    test("isBackupV1", () => {
        expect(isBackupV1({})).toBe(false);
        expect(isBackupV1(null)).toBe(false);
        expect(isBackupV1([])).toBe(false);

        let data: BackupV1 = {
            settings: {
                shifts: [],
                rhythm: [],
                startDate: "",
            },
            storage: {},
        };
        expect(isBackupV1(data)).toBe(true);

        data.settings.shifts.push({
            id: new Date().getTime(),
            name: "Name",
            shortName: "Short",
            visible: true,
        });
        expect(isBackupV1(data)).toBe(true);

        data.settings.shifts[0].color = "#ffffff";
        expect(isBackupV1(data)).toBe(true);

        data.settings.shifts[0].color = null;
        expect(isBackupV1(data)).toBe(true);

        data.settings.rhythm.push(0, 1, 2);
        expect(isBackupV1(data)).toBe(true);

        data.storage["db-2025-2"] = {
            "2025-2-4": {
                shift: null,
                note: "Arzt Besuch",
            },
        };
        expect(isBackupV1(data)).toBe(true);

        data.storage["db-2025-2"]["2025-2-4"].shift = data.settings.shifts[0];
        expect(isBackupV1(data)).toBe(true);
    });
});

describe("pages -> settings -> backup-utils", () => {
    test("convertV1", () => {
        const data: BackupV1 = {
            settings: {
                shifts: [],
                rhythm: [],
                startDate: "",
            },
            storage: {
                "db-2025-2": {
                    "2025-2-4": {
                        shift: {
                            id: new Date().getTime(),
                            name: "Name",
                            shortName: "Short",
                            visible: true,
                        },
                        note: "Arzt Besuch",
                    },
                },
            },
        };

        const result: BackupV3 = {
            weekStart: 0,
            shifts: [],
            rhythm: [],
            startDate: 0,
            version: {
                version: constants.version,
                build: constants.build,
            },
            indexedDB: {
                version: 1,
                data: [
                    {
                        year: 2025,
                        month: 2,
                        date: 4,
                        shift: {
                            id: data.storage["db-2025-2"]["2025-2-4"].shift!.id,
                            name: "Name",
                            shortName: "Short",
                            visible: true,
                        },
                        note: "Arzt Besuch",
                    },
                ],
            },
        };

        expect(convertV1(data)).toStrictEqual(result);

        data.settings.startDate = "2025-02-04";
        result.startDate = new Date("2025-02-04").getTime();
        expect(convertV1(data)).toStrictEqual(result);
    });
});

describe("pages -> settings -> backup-utils", () => {
    test("convertV2", () => {
        const data: BackupV2 = {
            settings: {
                shifts: [],
                rhythm: [],
                startDate: "",
            },
            indexedDB: {
                version: 1,
                data: [
                    {
                        year: 2025,
                        month: 2,
                        date: 4,
                        shift: {
                            id: new Date().getTime(),
                            name: "Name",
                            shortName: "Short",
                            visible: true,
                        },
                        note: "Arzt Besuch",
                    },
                ],
            },
        };

        const result: BackupV3 = {
            weekStart: 0,
            shifts: [],
            rhythm: [],
            startDate: 0,
            version: {
                version: constants.version,
                build: constants.build,
            },
            indexedDB: data.indexedDB,
        };

        expect(convertV2(data)).toStrictEqual(result);

        data.settings.startDate = "2025-02-04";
        result.startDate = new Date("2025-02-04").getTime();
        expect(convertV2(data)).toStrictEqual(result);
    });
});
