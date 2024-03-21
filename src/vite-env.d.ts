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

/*
 * js: "lang" types
 */

type _LangDataGroups =
  "dialog date-picker" |
  "dialog day" |
  "dialog rhythm" |
  "dialog shift" |
  "dialog storage" |
  "view settings" |
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
  "dialog date-picker": _LangDataKey;
  "dialog day": _LangDataKey;
  "dialog rhythm": _LangDataKey;
  "dialog shift": _LangDataKey;
  "dialog storage": _LangDataKey;
  "view settings": _LangDataKey;
  "view pdf": _LangDataKey;
  "app-bar": _LangDataKey;
  "footer": _LangDataKey;
  "buttons": _LangDataKey;
  "week-days": _LangDataKey;
  "months": _LangDataKey;
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

/*
 * misc
 */

interface _Shift {
  id: number;
  name: string;
  shortName: string;
  visible: boolean;
  color?: string;
}
