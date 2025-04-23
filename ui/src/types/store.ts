export type WeekStart = 0 | 1;

export interface Shift {
    /** NOTE: Just a timestamp */
    id: number;

    name: string;
    shortName: string;
    visible: boolean;
    color?: string | null;
    colorSwitch?: boolean;

    times?: {
        /**
         * @example "14:00"
         */
        from: string;
        /**
         * @example "22:00"
         */
        to: string;
    } | null;

    theme?: Theme;
}

export type Shifts = Shift[];
export type Rhythm = number[];
export type StartDate = number;

export interface EditMode {
    open: boolean;
    active: number;
}

export interface Version {
    version: string;
    build: number;
}

export interface Theme {
    hue: number;
}
