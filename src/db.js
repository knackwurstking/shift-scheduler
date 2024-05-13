import utils from "./utils";

/**
 * @typedef {import("./types").DBDataEntry} DBDataEntry
 */

export class DB {
    /** @type {IDBOpenDBRequest | null} */
    #request = null;

    /**
     * Database to access user edited shifts and notes per day.
     * To keep it simple, you will get data per month
     *
     * @param {string} dbName
     * @param {number} version
     */
    constructor(dbName, version) { // {{{
        this.dbName = dbName
        this.version = version
        this.storeName = "user"
        this.open();
    } // }}}

    close() { // {{{
        if (this.#request !== null) this.#request.result.close();
    } // }}}

    /** @param {DBDataEntry} entry */
    validate(entry) { // {{{
        if (typeof entry.year !== "number" || typeof entry.month !== "number" || typeof entry.date !== "number") {
            return false;
        }

        if (typeof entry.note !== "number") {
            entry.note = ""
        }

        if (entry.shift !== null) {
            if (!utils.validateShift(entry.shift)) {
                return false;
            }
        }

        return true;
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @param {number} date
     * @returns {Promise<DBDataEntry | null>} - Returns null on error (no entry found)
     */
    async get(year, month, date) { // {{{
        return await new Promise((resolve) => {
            const r = this.roStore().get([year, month, date]);

            r.onsuccess = () => {
                if (r.result === undefined) resolve(null);
                else resolve(r.result.data);
            };

            r.onerror = (ev) => {
                console.warn(`[DB] Error while getting "${year}-${month}-${date}" from the "${this.storeName}" store!`, ev);
                resolve(null);
            };
        });
    } // }}}

    /** @returns {Promise<DBDataEntry[]>} */
    async getAll() { // {{{
        return await new Promise((resolve) => {
            const r = this.roStore().getAll()

            r.onsuccess = () => resolve(r.result);
            r.onerror = (e) => {
                console.warn(`[DB] Error while getting all data from the store: "${this.storeName}"`, e);
                resolve([]);
            };
        });
    } // }}}

    /**
     * @param {DBDataEntry} data
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async add(data) { // {{{
        return await new Promise((resolve, reject) => {
            const r = this.rwStore().add(data);

            r.onsuccess = () => resolve();
            r.onerror = async (ev) => {
                console.warn(`[DB] Error while adding "${data.year}-${data.month}-${data.date}" to "${this.storeName}"! Try put now...`, ev);
                reject(r.error);
            };
        });
    } // }}}

    /**
     * @param {DBDataEntry} data
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async put(data) { // {{{
        return await new Promise((resolve, reject) => {
            const r = this.rwStore().put(data);

            r.onsuccess = () => resolve();
            r.onerror = async (ev) => {
                console.warn(`[DB] Error while putting "${data.year}-${data.month}-${data.date}" to "${this.storeName}"!`, ev);
                reject(r.error);
            };
        });
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @param {number} date
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async delete(year, month, date) { // {{{
        return await new Promise((resolve, reject) => {
            const r = this.rwStore().delete([year, month, date]);

            r.onsuccess = () => resolve();
            r.onerror = (ev) => {
                console.debug(`[DB] Deleting entry "${year}-${month}-${date}" from "${this.storeName}" failed!`, ev);
                reject(r.error);
            };
        });
    } // }}}

    async deleteAll() { // {{{
        // TODO: Delete all database entries
    } // }}}

    /** @private */
    open() { // {{{
        this.#request = window.indexedDB.open(this.dbName, this.version);
        this.#request.onerror = this.onError.bind(this);
        this.#request.onblocked = this.onBlocked.bind(this);
        this.#request.onsuccess = this.onSuccess.bind(this);
        this.#request.onupgradeneeded = this.onUpgradeNeeded.bind(this);
    } // }}}

    /** @private */
    roStore() { // {{{
        return this.#request.result
            .transaction(this.storeName, "readonly")
            .objectStore(this.storeName);
    } // }}}

    /** @private */
    rwStore() { // {{{
        return this.#request.result
            .transaction(this.storeName, "readwrite")
            .objectStore(this.storeName);
    } // }}}

    /**
     * @private
     * @param {IDBDatabase} db
     */
    createStore(db) { // {{{
        if (!db.objectStoreNames.contains(this.storeName)) {
            const o = db.createObjectStore(this.storeName, {
                autoIncrement: false,
                keyPath: ["year", "month", "date"],
            });
            o.createIndex("year", "year", { unique: false });
            o.createIndex("month", "month", { unique: false });
            o.createIndex("date", "date", { unique: false });
            o.createIndex("note", "note", { unique: false });
            o.createIndex("shift", "shift", { unique: false });
        }
    } // }}}

    /**
     * @private
     * @param {Event} ev
     */
    onError(ev) { // {{{
        console.error(`[DBCustom] Handle request failed: ${this.dbName}`, {
            error: this.#request.error,
            event: ev,
        });
        alert(`[DBCustom] Handle request failed: ${this.dbName} (see console)`);
    } // }}}

    /**
     * @private
     * @param {IDBVersionChangeEvent} ev
     */
    onBlocked(ev) { // {{{
        console.warn(`[DBCustom] Handle request blocked: ${this.dbName}`, {
            error: this.#request.error,
            event: ev,
        });
        alert(`[DBCustom] Handle request blocked: ${this.dbName} (see console)`);
    } // }}}

    /**
     * @private
     * @param {Event} ev
     */
    onSuccess(ev) { // {{{
        console.debug(`[DBCustom] Handle request success: ${this.dbName}`, ev);
    } // }}}

    /**
     * @private
     * @param {IDBVersionChangeEvent} ev
     */
    onUpgradeNeeded(ev) { // {{{
        console.debug(`[DBCustom] Handle request upgradeneeded: ${this.dbName}`, ev);

        switch (ev.oldVersion) {
            case 0:
                this.createStore(this.#request.result);
                break;
        }
    } // }}}
}

export default new DB("shift-scheduler", 1)
