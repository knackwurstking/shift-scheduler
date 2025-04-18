import { DBEntry } from "./database";
import { Rhythm, Shifts, StartDate, Theme, Version, WeekStart } from "./store";

// NOTE: >= v1.4.0 && <= v1.5.3
export interface BackupV1 {
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
    storage: {
        [key: string]: {
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
    weekStart: WeekStart;
    shifts: Shifts;
    rhythm: Rhythm;
    startDate: StartDate;
    version: Version;
    theme?: Theme;
    indexedDB: {
        version: number;
        data: DBEntry[];
    };
}
