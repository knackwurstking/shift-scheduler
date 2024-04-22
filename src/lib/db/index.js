import constants from "../constants";

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
    constructor(dbName, version) {
        this.#open(dbName, version);
    }

    close() {
        this.#request?.result.close();
    }

    /**
     * @returns {Promise<import("../../types").DBEntry[]>}
     */
    async getAll() {
        // TODO: Get all database entries

        return []
    }

    /**
     * @param {number} year
     * @param {number} month
     * @returns {Promise<import("../../types").DBEntry | null>} - Returns null on error (no entry found)
     */
    async get(year, month) {
        return await new Promise((resolve) => {
            const r = this.#roStore().get(`${year}/${month}`);
            r.onsuccess = () => {
                resolve(r.result);
            };
            r.onerror = (e) => {
                if (constants.debug)
                    console.warn(
                        `[DB] Error while getting "${year}/${month}" from the database!`,
                        e,
                    );
                resolve(null);
            };
        });
    }

    /**
     * @param {number} year
     * @param {number} month
     * @param {import("../../types").DBEntryData} data
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async add(year, month, data) {
        return await new Promise((resolve, reject) => {
            const r = this.#rwStore().add({ id: `${year}/${month}`, data: data });

            r.onsuccess = () => {
                if (constants.debug)
                    console.log(
                        `[DB] Add data for "${year}/${month}" was a success.`,
                    );
                resolve();
            };

            r.onerror = async (e) => {
                if (constants.debug)
                    console.warn(
                        `[DB] Error while adding "${year}/${month}" to the database! Try put now...`,
                        e,
                    );

                reject(r.error);
            };
        });
    }

    /**
     * @param {number} year
     * @param {number} month
     * @param {import("../../types").DBEntryData} data
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async put(year, month, data) {
        return await new Promise((resolve, reject) => {
            const r = this.#rwStore().put({ id: `${year}/${month}`, data: data });

            r.onsuccess = () => {
                if (constants.debug)
                    console.log(
                        `[DB] Put data for "${year}/${month}" was a success.`,
                    );

                resolve();
            };

            r.onerror = async (e) => {
                if (constants.debug)
                    console.warn(
                        `[DB] Error while putting "${year}/${month}" to the database!`,
                        e,
                    );

                reject(r.error);
            };
        });
    }

    /**
     * @param {number} year
     * @param {number} month
     * @returns {Promise<void>} - Returns null on error (no entry found)
     */
    async delete(year, month) {
        return await new Promise((resolve, reject) => {
            const r = this.#rwStore().delete(`${year}/${month}`);
            r.onsuccess = () => {
                if (constants.debug)
                    console.log(`[DB] Deleted entry for "${year}/${month}"`);

                resolve();
            };

            r.onerror = (e) => {
                if (constants.debug)
                    console.log(
                        `[DB] Deleting entry "${year}/${month}" failed!`,
                        e,
                    );

                reject(r.error);
            };
        });
    }

    #roStore() {
        return this.#request.result
            .transaction("months", "readonly")
            .objectStore(storeMonths);
    }

    #rwStore() {
        return this.#request.result
            .transaction("months", "readwrite")
            .objectStore(storeMonths);
    }

    /**
     * @param {string} dbName
     * @param {number | null} version
     */
    #open(dbName, version) {
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
            if (constants.debug)
                console.log(`[DBCustom] Handle request success: ${dbName}`, e);
        };

        this.#request.onupgradeneeded = (e) => {
            if (constants.debug)
                console.log(
                    `[DBCustom] Handle request upgradeneeded: ${dbName}`,
                    e,
                );

            switch (e.oldVersion) {
                case 0:
                    if (constants.debug)
                        console.log(`[DBCustom] Create database "${dbName}"`);

                    this.#createStore(this.#request.result);

                    break;
            }
        };
    }

    /**
     * @param {IDBDatabase} db
     */
    #createStore(db) {
        if (db.objectStoreNames.contains(storeMonths))
            db.createObjectStore(storeMonths, {
                autoIncrement: false,
                keyPath: "id",
            });
    }
}
