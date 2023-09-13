/**
 * @typedef StorageData
 * @type {{
 *  date: Date,
 *  shift: import("../../components/settings").Shift,
 *  note: string,
 * }}
 */

export const dbName = "db";
export const currentVersion = 1;

/** @type {IDBDatabase} */
export let db;

export function open() {
    return new Promise((resolve, reject) => {
        if (db) {
            return db;
        }

        const request = indexedDB.open(dbName, currentVersion);

        request.onupgradeneeded = (ev) => {
            const result = request.result;

            switch (ev.oldVersion) {
                case 0:
                    const store = result.createObjectStore("data", { keyPath: "date" });
                    store.createIndex("shift", "note", { unique: false });
                    store.createIndex("note", "note", { unique: false });
                    store.createIndex("date", "date", { unique: true });
                case 1:
                    if (!result.objectStoreNames.contains("data")) {
                        const store = result.createObjectStore("data", { keyPath: "date" });
                        store.createIndex("shift", "note", { unique: false });
                        store.createIndex("note", "note", { unique: false });
                        store.createIndex("date", "date", { unique: true });
                    }
            }
        };

        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
    });
}

/**
 *
 * @param {Date} date
 * @returns {Promise<StorageData | null>}
 */
export function get(date) {
    return new Promise(async (resolve, reject) => {
        if (!db) await open();
        const store = db.transaction("data", "readwrite").objectStore("data");
        const req = store.get(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
        req.onsuccess = (ev) => {
            // @ts-ignore
            const item = ev.target.result;
            if (item) {
                item.date = new Date(item.date);
            }
            resolve(item || null);
        };
        req.onerror = (ev) => {
            reject(req.error);
        };
    });
}

/**
 *
 * @param {Date} date
 * @param {import("../../components/settings").Shift} shift
 * @param {string} note
 */
export function set(date, shift, note) {
    return new Promise(async (resolve, reject) => {
        if (!db) await open();
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
 * @param {import("../../components/settings").Shift} shift
 * @param {string} note
 */
export function put(date, shift, note) {
    return new Promise(async (resolve, reject) => {
        if (!db) await open();
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
    if (!db) await open();
    const store = db.transaction("data", "readwrite").objectStore("data");
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const req = store.delete(key);
    req.onerror = () => {
        console.error(`delete ${key} failed:`, req.error);
    };
}
