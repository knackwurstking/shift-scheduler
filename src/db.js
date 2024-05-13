import utils from "./utils";

/**
 * @typedef {import("./types").DBEntry} DBEntry
 * @typedef {import("./types").DBEntryData} DBEntryData
 */

const storeMonths = "months";

export class DB {
    /** @type {IDBOpenDBRequest} */
    #request;

    /**
     * Database to access user edited shifts and notes per day.
     * To keep it simple, you will get data per month
     *
     * @param {string} dbName
     * @param {number} version
     */
    constructor(dbName, version) { // {{{
        this._open(dbName, version);
    } // }}}

    close() { // {{{
        this.#request?.result.close();
    } // }}}

    /** @param {DBEntry} entry */
    validate(entry) { // {{{
        if (typeof entry.id !== "string") {
            return false;
        }

        if (!Array.isArray(entry.data)) {
            return false;
        }

        let e;
        for (e of entry.data) {
            // Check for "date", "shift" and "note"
            if (e.shift !== null) {
                if (!utils.validateShift(e.shift)) {
                    return false;
                }
            }

            if (typeof e.note !== "string") {
                return false;
            }
        }

        return true;
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @returns {Promise<DBEntry | null>} - Returns null on error (no entry found)
     */
    async get(year, month) { // {{{
        return await new Promise((resolve) => {
            const r = this._roStore().get(`${year}/${month}`);
            r.onsuccess = () => {
                if (r.result === undefined) resolve(null);
                else resolve({
                    id: r.result.id,
                    data: JSON.parse(r.result.data),
                });
            };
            r.onerror = (e) => {
                console.warn(`[DB] Error while getting "${year}/${month}" from the database!`, e);
                resolve(null);
            };
        });
    } // }}}

    /** @returns {Promise<DBEntry[]>} */
    async getAll() { // {{{
        return await new Promise((resolve) => {
            const r = this._roStore().getAll()
            r.onsuccess = () => {
                resolve(r.result.map((data) => {
                    data.data = JSON.parse(data.data);
                    return data;
                }));
            };
            r.onerror = (e) => {
                console.warn(`[DB] Error while getting all data from the store: "${storeMonths}"`, e);
                resolve([]);
            };
        });
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @param {DBEntryData} data
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async add(year, month, data) { // {{{
        return await new Promise((resolve, reject) => {
            const r = this._rwStore().add({
                id: `${year}/${month}`,
                data: JSON.stringify(data),
            });

            r.onsuccess = () => {
                console.debug(`[DB] Add data for "${year}/${month}" was a success.`);
                resolve();
            };

            r.onerror = async (e) => {
                console.warn(`[DB] Error while adding "${year}/${month}" to the database! Try put now...`, e);

                reject(r.error);
            };
        });
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @param {DBEntryData} data
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async put(year, month, data) { // {{{
        return await new Promise((resolve, reject) => {
            const r = this._rwStore().put({
                id: `${year}/${month}`,
                data: JSON.stringify(data),
            });

            r.onsuccess = () => {
                console.debug(`[DB] Put data for "${year}/${month}" was a success.`);
                resolve();
            };

            r.onerror = async (e) => {
                console.warn(`[DB] Error while putting "${year}/${month}" to the database!`, e);

                reject(r.error);
            };
        });
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async delete(year, month) { // {{{
        return await new Promise((resolve, reject) => {
            const r = this._rwStore().delete(`${year}/${month}`);
            r.onsuccess = () => {
                console.debug(`[DB] Deleted entry for "${year}/${month}"`);

                resolve();
            };

            r.onerror = (e) => {
                console.debug(`[DB] Deleting entry "${year}/${month}" failed!`, e);

                reject(r.error);
            };
        });
    } // }}}

    async deleteAll() { // {{{
        // ...
    } // }}}

    /**
     * @param {string} dbName
     * @param {number | null} version
     */
    _open(dbName, version) { // {{{
        this.#request = window.indexedDB.open(dbName, version);

        this.#request.onerror = (e) => {
            console.error(`[DBCustom] Handle request failed: ${dbName}`, {
                error: this.#request.error,
                event: e,
            });
            alert(`[DBCustom] Handle request failed: ${dbName} (see console)`);
        };

        this.#request.onblocked = (e) => {
            console.warn(`[DBCustom] Handle request blocked: ${dbName}`, {
                error: this.#request.error,
                event: e,
            });
            alert(`[DBCustom] Handle request blocked: ${dbName} (see console)`);
        };

        this.#request.onsuccess = (e) => {
            console.debug(`[DBCustom] Handle request success: ${dbName}`, e);
        };

        this.#request.onupgradeneeded = (e) => {
            console.debug(`[DBCustom] Handle request upgradeneeded: ${dbName}`, e);

            switch (e.oldVersion) {
                case 0:
                    this._createStore(this.#request.result);
                    break;
            }
        };
    } // }}}

    /** @param {IDBDatabase} db */
    _createStore(db) { // {{{
        if (!db.objectStoreNames.contains(storeMonths)) {
            const o = db.createObjectStore(storeMonths, {
                autoIncrement: false,
                keyPath: "id",
            });
            o.createIndex("id", "id", { unique: true });
            o.createIndex("data", "data", { unique: false });
        }
    } // }}}

    _roStore() { // {{{
        return this.#request.result
            .transaction(storeMonths, "readonly")
            .objectStore(storeMonths);
    } // }}}

    _rwStore() { // {{{
        return this.#request.result
            .transaction(storeMonths, "readwrite")
            .objectStore(storeMonths);
    } // }}}
}

export default new DB("shift-scheduler", 1)
