export interface Entry {
    year: number;
    month: number;
    date: number;
    shift: Shift | null;
    note: string;
}
