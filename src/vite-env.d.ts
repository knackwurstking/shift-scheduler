/// <reference types="svelte" />
/// <reference types="vite/client" />

declare type Views = "calendar" | "settings";
declare type Themes = "default" | "custom" | "green";

declare interface Shift { // TODO: ShiftItem replaced with Shift
    name: string;
    shortName: string; // TODO: no longer optional (?:)
    visible: boolean; // TODO: no longer optional (?:)
}

declare interface Day { // TODO: `GridItemData` replaced with Day 
    default: Shift | null;
    shift: Shift | null;
    note: string; // TODO: note type alway be a `string` instead of `string | null`
}

declare interface Month {
    data: Day[]; // NOTE: length: 42
    monthCount: number;
}

declare interface GridItem { // TODO: no longer needed (replaced with calendar/View.svelte, type Month)
    title: string;
    disabled?: boolean;
    today?: boolean;
    data: Day | null;
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
