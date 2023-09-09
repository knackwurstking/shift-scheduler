const currentVersion = 1;
const request = indexedDB.open("db", currentVersion);

export let db;

request.onupgradeneeded = (ev) => {
    switch (ev.oldVersion) {
        case 0:
            const result = request.result;
            if (!result.objectStoreNames.contains("data")) {
                const store = result.createObjectStore("data");
                store.createIndex("shift", "note", { unique: false })
                store.createIndex("note", "note", { unique: false })
                store.createIndex("date", "date", { unique: true })
            }
    }
}

request.onerror = () => {
    console.error("DB Error:", request.error);
}

request.onsuccess = () => {
    db = request.result;
    console.debug("DB Ready!");
}

/**
 * 
 * @param {Date} date 
 * @returns {StorageItem | null}
 */
export function get(date) {
    // TODO: get shift item and note from storage or return null

    return null
}

/**
 * 
 * @param {Date} date 
 * @param {ShiftItem} shift 
 * @param {Note} note 
 */
export function set(date, shift, note) {
    // TODO: store (or replace) shift and note for date
}

/**
 * 
 * @param {Date} date 
 */
export function remove(date) {
    // TODO: remove data for keyPath
}
