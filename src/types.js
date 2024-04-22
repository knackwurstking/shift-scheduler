/**
 * @typedef Shift 
 * @type {{
 *  id: number; // Just a timestamp
 *  name: string;
 *  shortName: string;
 *  visible: boolean;
 *  color?: string;
 * }}
 *
 * @typedef ShiftSettings
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
 *  settings: ShiftSettings;
 *  indexedDB: DBEntry[];
 * }}
 */

/** @type {Shift} */
export const shift = {
    id: 0,
    name: "",
    shortName: "",
    visible: true,
    color: "",
}

/** @type {ShiftSettings} */
export const shiftSettings = {
    shifts: [],
    rhythm: [],
    startDate: "", // ...
}
