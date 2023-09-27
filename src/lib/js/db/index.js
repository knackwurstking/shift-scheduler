
import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

/**
 * @typedef StorageData
 * @type {{
 *  shift: import("../../components/settings").Shift | null,
 *  note: string,
 * }}
 *
 * @typedef DBData
 * @type {{
 *  [date: string]: StorageData,
 * }}
 */

/**
 *
 * @param {any} data
 * @returns {boolean}
 */
export function validateDBData(data) {
    try {
        for (const [k, v] of Object.entries(data)) {
            if (typeof k === "string") {
                if (!Object.hasOwn(v, "shift") || !Object.hasOwn(v, "note")) {
                    return false;
                }

                // check "shift"
                if (v.shift !== null) {
                    if (
                        !Object.hasOwn(v.shift, "id") ||
                        !Object.hasOwn(v.shift, "name") ||
                        !Object.hasOwn(v.shift, "shortName") ||
                        !Object.hasOwn(v.shift, "visible")
                    ) {
                        return false;
                    }

                    if (
                        typeof v.shift.id !== "number" ||
                        typeof v.shift.name !== "string" ||
                        typeof v.shift.shortName !== "string" ||
                        typeof v.shift.visible !== "boolean"
                    ) {
                        return false;
                    }
                }

                // check "note"
                if (typeof v.note !== "string") {
                    return false;
                }
            }
        }
    } catch {
        return false;
    }

    return true;
}

/**
 * @returns {Date[]}
 */
export function list() {
    /** @type {Date[]}  */
    const keys = [];

    for (let x = 0; x < window.localStorage.length; x++) {
        const key = window.localStorage.key(x);
        const split = key.split("-", 3);

        if (split.length === 3) {
            if (split[0] !== "db") continue;

            const year = parseInt(split[1], 10);
            const month = parseInt(split[2], 10);

            if (isNaN(year) || isNaN(month)) continue;
            if (month < 0 || month > 11) continue;

            keys.push(new Date(year, month));
        }
    }

    return keys;
}

/**
 *
 * @param {Date} date
 */
export function getKeyFromDate(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 *
 * @param {Date} date
 * @returns {Promise<StorageData | null>}
 */
export function getDataForDay(date) {
    const data = get(date.getFullYear(), date.getMonth());
    return data[getKeyFromDate(date)] || { shift: null, note: "" };
}

/**
 *
 * @param {number} year
 * @param {number} month
 * @returns {Promise<DBData>}
 */
export async function get(year, month) {
    const rawData = window.localStorage.getItem(`db-${year}-${month}`);
    if (!rawData) return {};
    return JSON.parse(rawData);
}

/**
 *
 * @param {number} year
 * @param {number} month
 * @param {DBData} data
 */
export async function set(year, month, data) {
    window.localStorage.setItem(`db-${year}-${month}`, JSON.stringify(data));
}

/**
 *
 * @param {number} year
 * @param {number} month
 */
export async function remove(year, month) {
    window.localStorage.removeItem(`db-${year}-${month}`);
}

/**
 *
 * @param {Date} date
 * @param {import("../../components/settings").Shift | null} shift
 * @param {string} note
 */
export async function setDataForDay(date, shift, note) {
    const data = await get(date.getFullYear(), date.getMonth());
    data[await getKeyFromDate(date)] = { shift: shift, note: note };
    await set(date.getFullYear(), date.getMonth(), data);
}

/**
 *
 * @param {Date} date
 */
export async function removeDataForDay(date) {
    const data = await get(date.getFullYear(), date.getMonth());
    delete data[await getKeyFromDate(date)];
    await set(date.getFullYear(), date.getMonth(), data);
}

export async function getAll() {
    /** @type {{ [key: string]: DBData }} */
    const data = {};
    for (const date of list()) {
        data[`db-${date.getFullYear()}-${date.getMonth()}`] = await get(
            date.getFullYear(),
            date.getMonth()
        );
    }
    return data;
}

/**
 *
 * @param {{ [key: string]: DBData }} data
 * @param {"browser" | "android"} platform
 */
export async function exportAllData(data, platform = "browser") {
    switch (platform) {
        case "browser":
            await _exportBrowser(data);
            break;
        case "android":
            await _exportAndroid(data);
        default:
            throw `Unknown platform "android"`;
    }
}

/**
 *
 * @param {{ [key: string]: DBData }} data
 */
async function _exportBrowser(data) {
    const blob = new Blob(
        [JSON.stringify(data)],
        { type: "octet/stream" }
    );

    const a = document.createElement("a");

    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.setAttribute("download", "shift-scheduler-storage-data.json");

    a.click();
}

/**
 * 
 * @param {{ [key: string]: DBData }} data
 */
async function _exportAndroid(data) {
    const file = "shift-scheduler-storage-data.json";

    const result = await Filesystem.writeFile({
        path: file,
        data: JSON.stringify(data),
        encoding: Encoding.UTF8,
        directory: Directory.Cache,
    });

    Share.share({
        title: file,
        url: result.uri,
        dialogTitle: "Storage data backup",
    });
}
