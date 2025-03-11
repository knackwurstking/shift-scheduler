import { Shift } from "./calendar";

export interface DBEntry {
    year: number;
    month: number;
    date: number;
    shift: Shift | null;
    note: string;
}
