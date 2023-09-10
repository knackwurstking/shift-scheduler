export const dbName = "db";
export const currentVersion = 1;

/** @type {IDBDatabase} */
export let db;

export function open() {
    return new Promise((resolve, reject) => {
        if (db) {
            return db
        }

        const request = indexedDB.open(dbName, currentVersion);

        request.onupgradeneeded = (ev) => {
            console.debug("upgrade database");
            const result = request.result;

            switch (ev.oldVersion) {
                case 0:
                    const store = result.createObjectStore("data", { keyPath: "date" });
                    store.createIndex("shift", "note", { unique: false })
                    store.createIndex("note", "note", { unique: false })
                    store.createIndex("date", "date", { unique: true })
                case 1:
                    if (!result.objectStoreNames.contains("data")) {
                        const store = result.createObjectStore("data", { keyPath: "date" });
                        store.createIndex("shift", "note", { unique: false })
                        store.createIndex("note", "note", { unique: false })
                        store.createIndex("date", "date", { unique: true })
                    }
            }
        };

        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.debug("DB Ready!");
            resolve(db);
        };
    });
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
export function set(date, shift, note) {
    return new Promise((resolve, reject) => {
        const store = db.transaction("data", "readwrite").objectStore("data");
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const data = {
            date: key,
            shift: shift,
            note: note,
        };
        const req = store.add(data);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(null);
    });
}

/**
 * 
 * @param {Date} date 
 * @param {ShiftItem} shift 
 * @param {string} note 
 */
export function put(date, shift, note) {
    return new Promise((resolve, reject) => {
        const store = db.transaction("data", "readwrite").objectStore("data");
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const data = {
            date: key,
            shift: shift,
            note: note,
        };
        const req = store.put(data);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(null);
    });
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