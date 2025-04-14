// @vitest-environment jsdom

import { backupUtils, BackupV1, BackupV2, BackupV3, constants } from "@lib";
import { describe, expect, test } from "vitest";

describe("pages -> settings -> backup-utils", () => {
    test("isBackupV3", () => {
        expect(backupUtils.isBackupV3({})).toBe(false);
        expect(backupUtils.isBackupV3(null)).toBe(false);
        expect(backupUtils.isBackupV3([])).toBe(false);

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
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.shifts.push({
            id: new Date().getTime(),
            name: "Name",
            shortName: "Short",
            visible: true,
        });
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.shifts[0].color = "#ffffff";
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.shifts[0].color = null;
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.shifts[0].times = null;
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.shifts[0].times = {
            from: "6:00",
            to: "14:00",
        };
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.rhythm.push(0, 1, 2);
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.indexedDB.data.push({
            year: 2025,
            month: 2,
            date: 13,
            shift: null,
            note: "",
        });
        expect(backupUtils.isBackupV3(data)).toBe(true);

        data.indexedDB.data[0].shift = data.shifts[0];
        expect(backupUtils.isBackupV3(data)).toBe(true);
    });
});

describe("pages -> settings -> backup-utils", () => {
    test("isBackupV2", () => {
        expect(backupUtils.isBackupV2({})).toBe(false);
        expect(backupUtils.isBackupV2(null)).toBe(false);
        expect(backupUtils.isBackupV2([])).toBe(false);

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
        expect(backupUtils.isBackupV2(data)).toBe(true);

        data.settings.shifts.push({
            id: new Date().getTime(),
            name: "Name",
            shortName: "Short",
            visible: true,
        });
        expect(backupUtils.isBackupV2(data)).toBe(true);

        data.settings.shifts[0].color = "#ffffff";
        expect(backupUtils.isBackupV2(data)).toBe(true);

        data.settings.shifts[0].color = null;
        expect(backupUtils.isBackupV2(data)).toBe(true);

        data.settings.rhythm.push(0, 1, 2);
        expect(backupUtils.isBackupV2(data)).toBe(true);

        data.indexedDB.data.push({
            year: 2025,
            month: 2,
            date: 13,
            shift: null,
            note: "",
        });
        expect(backupUtils.isBackupV2(data)).toBe(true);

        data.indexedDB.data[0].shift = data.settings.shifts[0];
        expect(backupUtils.isBackupV2(data)).toBe(true);
    });
});

describe("pages -> settings -> backup-utils", () => {
    test("isBackupV1", () => {
        expect(backupUtils.isBackupV1({})).toBe(false);
        expect(backupUtils.isBackupV1(null)).toBe(false);
        expect(backupUtils.isBackupV1([])).toBe(false);

        let data: BackupV1 = {
            settings: {
                shifts: [],
                rhythm: [],
                startDate: "",
            },
            storage: {},
        };
        expect(backupUtils.isBackupV1(data)).toBe(true);

        data.settings.shifts.push({
            id: new Date().getTime(),
            name: "Name",
            shortName: "Short",
            visible: true,
        });
        expect(backupUtils.isBackupV1(data)).toBe(true);

        data.settings.shifts[0].color = "#ffffff";
        expect(backupUtils.isBackupV1(data)).toBe(true);

        data.settings.shifts[0].color = null;
        expect(backupUtils.isBackupV1(data)).toBe(true);

        data.settings.rhythm.push(0, 1, 2);
        expect(backupUtils.isBackupV1(data)).toBe(true);

        data.storage["db-2025-2"] = {
            "2025-2-4": {
                shift: null,
                note: "Arzt Besuch",
            },
        };
        expect(backupUtils.isBackupV1(data)).toBe(true);

        data.storage["db-2025-2"]["2025-2-4"].shift = data.settings.shifts[0];
        expect(backupUtils.isBackupV1(data)).toBe(true);
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

        expect(backupUtils.convertV1(data)).toStrictEqual(result);

        data.settings.startDate = "2025-02-04";
        result.startDate = new Date("2025-02-04").getTime();
        expect(backupUtils.convertV1(data)).toStrictEqual(result);
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

        expect(backupUtils.convertV2(data)).toStrictEqual(result);

        data.settings.startDate = "2025-02-04";
        result.startDate = new Date("2025-02-04").getTime();
        expect(backupUtils.convertV2(data)).toStrictEqual(result);
    });
});
