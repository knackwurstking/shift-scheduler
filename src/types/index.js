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
 * @typedef EditModeStore
 * @type {{
 *  open: boolean;
 *  active: Shift | null;
 * }}
 *
 * @typedef UIStoreEvents
 * @type {{
 *  "date-picker": DatePickerStore;
 *  "theme": ThemeStore;
 *  "week-start": WeekStartStore;
 *  "settings": SettingsStore;
 *  "debug": DebugStore;
 *  "lang": LangStore;
 *  "edit-mode": EditModeStore;
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
 * @typedef BackupV1
 * @type {{
 *  settings: SettingsStore;
 *  indexedDB: BackupV1Indexed;
 * }}
 *
 * @typedef BackupV1Indexed
 * @type {{
 *  version: number;
 *  data: DBDataEntry[];
 * }}
 *
 * @typedef OldBackup
 * @type {{
 *  settings: SettingsStore;
 *  storage: OldBackupStorage;
 * }}
 *
 * @typedef OldBackupStorage
 * @type {{
 *  [key: string]: {
 *      [key: string]: {
 *          shift: {
 *              id: number; // Just a timestamp
 *              name: string;
 *              shortName: string;
 *              visible: boolean;
 *              color?: string;
 *          } | null;
 *          note: string;
 *      };
 *  };
 * }}
 */

export { };
