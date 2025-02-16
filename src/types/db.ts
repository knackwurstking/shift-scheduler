import * as calendar from "./calendar";

export interface Entry {
    year: number;
    month: number;
    date: number;
    shift: calendar.Shift | null;
    note: string;
}
