/**
 * @typedef Languages
 * @type {"en" | "de"}
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
 * @typedef Settings
 * @type {{
 *  shifts: Shift[];
 *  rhythm: number[];
 *  startDate: string; // "yyyy-mm-dd", padStart with "0"
 * }}
 *
 * @typedef DBEntryDataItem
 * @type {{
 *  date: Date;
 *  shift: Shift | null;
 *  note: string;
 * }}
 *
 * @typedef DBEntryData
 * @type {DBEntryDataItem[]}
 *
 * @typedef DBEntry
 * @type {{
 *  id: string; // "YYYY/MM"
 *  data: DBEntryData;
 * }}
 *
 * @typedef Backup
 * @type {{
 *  settings: Settings;
 *  indexedDB: DBEntry[];
 * }}
 */

export {};
