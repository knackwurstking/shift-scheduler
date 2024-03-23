/// <reference types="svelte" />
/// <reference types="vite/client" />

/*
 * js: "db" (database) types
 */

interface _DBDataValue {
  shift: _Shift | null;
  note: string;
}

interface _DBData {
  [date: string]: DBDataValue;
}

interface _Shift {
  id: number;
  name: string;
  shortName: string;
  visible: boolean;
  color?: string;
}

/*
 * js: "lang" types
 */

type _LangDataGroups =
  "dialog date-picker" |
  "dialog day" |
  "dialog rhythm" |
  "dialog shift" |
  "dialog storage" |
  "settings backup" |
  "settings shifts" |
  "settings misc" |
  "settings storage" |
  "view pdf" |
  "app-bar" |
  "footer" |
  "buttons" |
  "week-days" |
  "months";

interface _LangDataKey {
  [key: string]: string;
}

interface _LangData {
  "dialog date-picker": {
    "title": string;
    "android input": string;
    "input year": string;
    "input month": string;
  };
  "dialog day": {
    "textfield": string;
  };
  "dialog rhythm": {
    "title": string;
  };
  "dialog shift": {
    "edit shift title": string;
    "new shift title": string;
    "long name": string;
    "short name": string;
    "hide shift": string;
    "color picker": string;
  };
  "dialog storage": {
    "table header day": string;
    "table header shift": string;
    "table header note": string;
  };
  "settings backup": {
    "title": string;
  };
  "settings shifts": {
    "title": string;
    "table header name": string;
    "table header short name": string;
    "table header color": string;
    "button new shift": string;
    "start date": string;
    "rhythm": string;
  };
  "settings misc": {
    "title": string;
    "theme picker": string;
    "week start": string;
  };
  "settings storage": {
    "title": string
    "button fetch data": string;
    "table header year": string;
    "table header month": string;
  };
  "pdf": {
    "year picker": string;
  };
  "app-bar": {
    "calendar": string;
    "settings": string;
    "pdf": string;
  };
  "footer": {
    "edit mode": string;
  };
  "buttons": {
    "edit": string;
    "submit": string;
  };
  "week-days": {
    "sun": string;
    "mon": string;
    "tue": string;
    "wed": string;
    "thu": string;
    "fri": string;
    "sat": string;
  };
  "months": {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    "6": string;
    "7": string;
    "8": string;
    "9": string;
    "10": string;
    "11": string;
    "12": string;
  };
}

interface _Lang {
  "en": _LangData;
  "de": _LangData;
}

/*
 * stores
 */

interface _ShiftSetup {
  shifts: _Shift[];
  rhythm: number[];
  startDate: string;
}

type _Themes =
  "system" |
  "dark" |
  "light";

type _Views =
  "calendar" |
  "settings" |
  "pdf";

type _WeekStartDays =
  "sun" |
  "mon";

/*
 * calendar
 */

interface _Day {
  date: Date;
  data: _DBDataValue;
}

/*
 * dialogs
 */

interface _DayDialogSubmit {
  date: {
    year: number;
    month: number;
    date: number;
  },
  shift: Shift | null;
  note: string;
}
