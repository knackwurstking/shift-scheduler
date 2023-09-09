/// <reference types="svelte" />
/// <reference types="vite/client" />

declare type Views = "calendar" | "settings";
declare type Themes = "default" | "custom" | "green";
declare type ShiftName = string;

declare interface GridItemData {
    default: ShiftItem | null;
    shift: ShiftItem | null;
    note: string | null;
}

declare interface GridItem {
    title: string;
    disabled?: boolean;
    today?: boolean;
    data: GridItemData | null;
}

declare interface DatePickerCurrent {
    year: number;
    month: number;
}

declare interface ShiftItem {
    name: ShiftName;
    shortName?: ShiftName;
    visible?: boolean;
}

declare interface Settings {
    shifts: ShiftItem[];
    startDate: string | Date;
    shiftRhythm: ShiftName[];
}

declare interface StorageItem {
    shift: ShiftItem | null;
    note: string | null;
    date: Date;
}
