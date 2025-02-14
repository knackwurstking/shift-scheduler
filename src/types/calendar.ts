export type WeekStart = 0 | 1;

export interface Shift {
    /** NOTE: Just a timestamp */
    id: number;

    name: string;
    shortName: string;
    visible: boolean;
    color?: string | null;
}

export interface EditMode {
    open: boolean;
    active: Shift | null;
}
