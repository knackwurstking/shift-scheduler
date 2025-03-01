import * as calendar from "./calendar";
import * as db from "./db";

export type Shifts = calendar.Shift[];
export type Rhythm = number[];
export type StartDate = number;

export interface Settings {
    shifts: Shifts;
    rhythm: Rhythm;
    startDate: StartDate;
}

export interface Version {
    version: string;
    build: number;
}

// TODO: Find out the correct version here
// NOTE: < v1.?.?
export interface BackupV0 {
    settings: Settings & { startData: string };
    storage: {
        [key: string]: {
            [key: string]: {
                shift: calendar.Shift | null;
                note: string;
            };
        };
    };
}

// NOTE: < v3.0.0
export interface BackupV1 {
    settings: Settings & { startData: string };
    indexedDB: {
        version: number;
        data: db.Entry[];
    };
}

// NOTE: >= v3.0.0
export interface BackupV3 {
    weekStart: calendar.WeekStart;
    settings: Settings;
    version: Version;
    indexedDB: {
        version: number;
        data: db.Entry[];
    };
}
