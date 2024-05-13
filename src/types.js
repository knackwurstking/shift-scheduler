/**
 * @typedef DatePickerStore
 * @type {string}
 *
 * @typedef ThemeStore
 * @type {{
 *  mode: "system" | "dark" | "light";
 *  name: string;
 * }}
 *
 * @typedef WeekStartStore
 * @type {0 | 1}
 *
 * @typedef SettingsStore
 * @type {{
 *  shifts: Shift[];
 *  rhythm: number[];
 *  startDate: string; // "yyyy-mm-dd"
 * }}
 *
 * @typedef DebugStore 
 * @type {boolean}
 *
 * @typedef LangStore
 * @type {"en" | "de"}
 *
 * @typedef StoreEvents
 * @type {{
 *  "date-picker": DatePickerStore;
 *  "theme": ThemeStore;
 *  "week-start": WeekStartStore;
 *  "settings": SettingsStore;
 *  "debug": DebugStore;
 *  "lang": LangStore;
 * }}
 *
 * @typedef Shift
 * @type {{
 *  id: number; // Just a timestamp
 *  name: string;
 *  shortName: string;
 *  visible: boolean;
 *  color?: string;
 * }}
 *
 * @typedef DBDataEntry
 * @type {{
 *  "year": number;
 *  "month": number;
 *  "date": number;
 *  "shift": Shift | null;
 *  "note": string;
 * }}
 *
 * @typedef Backup
 * @type {{
 *  settings: SettingsStore;
 *  indexedDB: {
 *      version: number;
 *      data: DBDataEntry[];
 *  };
 * }}
 */

export { };
