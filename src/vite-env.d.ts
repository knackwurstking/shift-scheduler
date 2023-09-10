/// <reference types="svelte" />
/// <reference types="vite/client" />

declare type Views = "calendar" | "settings";
declare type Themes = "default" | "custom" | "green";

declare interface Shift { // TODO: ShiftItem replaced with Shift
    name: string;
    shortName: string; // TODO: no longer optional (?:)
    visible: boolean; // TODO: no longer optional (?:)
}

declare interface DayData {
    shift: Shift | null;
    note: string;
}

declare interface Day { // TODO: `GridItemData` replaced with Day 
    date: number;
    
    today: boolean;
    disable: boolean;

    defaultShift: Shift | null;
    data: DayData;
}

declare interface Month {
    data: Day[]; // NOTE: length: 42
    monthCount: number;
}

declare interface DatePickerCurrent {
    year: number;
    month: number;
}

declare interface Settings {
    shifts: Shift[];
    startDate: string | Date;
    shiftRhythm: string[];
}

declare interface StorageItem {
    shift: Shift | null;
    note: string | null;
    date: Date;
}
