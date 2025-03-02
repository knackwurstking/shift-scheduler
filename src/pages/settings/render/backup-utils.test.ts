import { describe, test, expect } from "@jest/globals";

import { isBackupV3, isBackupV2 } from "./backup-utils";
import { BackupV3, BackupV2 } from "../../../types/settings";

describe("pages -> settings -> backup-utils", () => {
    test("isBackupV3", () => {
        expect(isBackupV3({})).toBe(false);
        expect(isBackupV3(null)).toBe(false);
        expect(isBackupV3([])).toBe(false);

        let data: BackupV3 = {
            weekStart: 0,
            settings: {
                shifts: [],
                rhythm: [],
                startDate: 0,
            },
            version: {
                version: "v3.0.0",
                build: 1,
            },
            indexedDB: {
                version: 0,
                data: [],
            },
        };
        expect(isBackupV3(data)).toBe(true);

        data.settings.shifts.push({
            id: new Date().getTime(),
            name: "Name",
            shortName: "Short",
            visible: true,
        });
        expect(isBackupV3(data)).toBe(true);

        data.settings.shifts[0].color = "#ffffff";
        expect(isBackupV3(data)).toBe(true);

        data.settings.shifts[0].color = null;
        expect(isBackupV3(data)).toBe(true);

        data.settings.rhythm.push(0, 1, 2);
        expect(isBackupV3(data)).toBe(true);

        data.indexedDB.data.push({
            year: 2025,
            month: 2,
            date: 13,
            shift: null,
            note: "",
        });
        expect(isBackupV3(data)).toBe(true);

        data.indexedDB.data[0].shift = data.settings.shifts[0];
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
