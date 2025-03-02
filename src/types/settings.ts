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

// NOTE: >= v1.4.0 && <= v1.5.3
export interface BackupV1 {
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

// NOTE: >= v2.0.0 && < v3.0.0
export interface BackupV2 {
    settings: {
        shifts: {
            id: number;
            name: string;
            shortName: string;
            visible: boolean;
            color?: string | null;
        }[];
        rhythm: number[];
        startDate: string;
    };
    indexedDB: {
        version: number;
        data: {
            year: number;
            month: number;
            date: number;
            shift: {
                id: number;
                name: string;
                shortName: string;
                visible: boolean;
                color?: string | null;
            } | null;
            note: string;
        }[];
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
