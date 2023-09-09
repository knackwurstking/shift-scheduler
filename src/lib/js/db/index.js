export const dbName = "db";
export const currentVersion = 1;

const request = indexedDB.open(dbName, currentVersion);

/** @type {IDBDatabase} */
export let db;

request.onupgradeneeded = (ev) => {
    switch (ev.oldVersion) {
        case 0:
            const result = request.result;
            if (!result.objectStoreNames.contains("data")) {
                const store = result.createObjectStore("data", { keyPath: "date" });
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
 * @param {(item: StorageItem | null) => void} callback 
 */
export async function get(date, callback) {
    const store = db.transaction("data", "readwrite").objectStore("data");
    const req = store.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
    req.onsuccess = (ev) => {
        // @ts-ignore
        const item = ev.target.result;
        if (item) {
            item.date = new Date(item);
        }
        callback(item || null);
    };
}

/**
 * 
 * @param {Date} date 
 * @param {ShiftItem} shift 
 * @param {string} note 
 */
export async function set(date, shift, note) {
    const store = db.transaction("data", "readwrite").objectStore("data");
    let key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const req = store.add({
        date: key,
        shift: shift,
        note: note,
    });
    req.onerror = () => {
        console.error(`set item with key ${key} failed:`, req.error);
    };
}

/**
 * 
 * @param {Date} date 
 */
export async function remove(date) {
    const store = db.transaction("data", "readwrite").objectStore("data");
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const req = store.delete(key);
    req.onerror = () => {
        console.error(`delete ${key} failed:`, req.error);
    }
}
