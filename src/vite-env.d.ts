/// <reference types="svelte" />
/// <reference types="vite/client" />

declare type Views = "calendar" | "settings";
declare type Themes = "default" | "custom" | "green";

/*
declare interface DayData {
    shift: Shift | null;
    note: string;
}

declare interface Day { // TODO: `GridItemData` replaced with Day 
    date: Date;
    
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

declare interface StorageItem {
    shift: Shift | null;
    note: string | null;
    date: Date;
}
*/