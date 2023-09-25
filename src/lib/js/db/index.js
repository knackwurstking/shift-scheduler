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
 *
 * @param {number} year
 * @param {number} month
 * @returns {DBData}
 */
export function get(year, month) {
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
export function set(year, month, data) {
    window.localStorage.setItem(`db-${year}-${month}`, JSON.stringify(data));
}

/**
 *
 * @param {number} year
 * @param {number} month
 */
export function remove(year, month) {
    window.localStorage.removeItem(`db-${year}-${month}`);
}

/**
 *
 * @param {Date} date
 * @returns
 */
export function getKeyFromDate(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 *
 * @param {Date} date
 * @returns {StorageData | null}
 */
export function getDataForDay(date) {
    const data = get(date.getFullYear(), date.getMonth());
    return data[getKeyFromDate(date)] || { shift: null, note: "" };
}

/**
 *
 * @param {Date} date
 * @param {import("../../components/settings").Shift | null} shift
 * @param {string} note
 */
export function setDataForDay(date, shift, note) {
    const data = get(date.getFullYear(), date.getMonth());
    data[getKeyFromDate(date)] = { shift: shift, note: note };
    set(date.getFullYear(), date.getMonth(), data);
}

/**
 *
 * @param {Date} date
 */
export function removeDataForDay(date) {
    const data = get(date.getFullYear(), date.getMonth());
    delete data[getKeyFromDate(date)];
    set(date.getFullYear(), date.getMonth(), data);
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
