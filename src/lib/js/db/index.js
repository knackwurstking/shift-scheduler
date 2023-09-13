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
 * @param {number} year
 * @param {number} month 
 * @returns {DBData}
 */
export function get(year, month) {
    const rawData = window.localStorage.getItem(
        `db-${year}-${month}`
    );
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
    window.localStorage.setItem(
        `db-${year}-${month}`,
        JSON.stringify(data)
    );
}

/**
 * 
 * @param {number} year 
 * @param {number} month 
 */
export function remove(year, month) {
    window.localStorage.removeItem(
        `db-${year}-${month}`
    );
}

/**
 * 
 * @param {Date} date 
 * @returns 
 */
export function getKeyFromDate(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
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
    set(date.getFullYear(), date.getMonth(), data)
}


/**
 * 
 * @param {Date} date 
 */
export function removeDataForDay(date) {
    const data = get(date.getFullYear(), date.getMonth());
    delete data[getKeyFromDate(date)];
    set(date.getFullYear(), date.getMonth(), data)
}
