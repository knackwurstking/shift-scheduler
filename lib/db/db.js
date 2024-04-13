import constants from "../constants";

const storeMonths = "months";

/**
 * @typedef DBShift
 * @type {import(".").DBShift}
 *
 * @typedef DBDay
 * @type {import(".").DBDay}
 *
 * @typedef DBMonth
 * @type {import(".").DBMonth}
 *
 * @typedef DBEntry
 * @type {import(".").DBEntry}
 */

export default class DB {
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

  #get() {
    return this.#request.result
      .transaction("months", "readonly")
      .objectStore(storeMonths);
  }

  #set() {
    return this.#request.result
      .transaction("months", "readwrite")
      .objectStore(storeMonths);
  }

  /**
   * @param {number} year
   * @param {number} month
   * @returns {Promise<DBEntry | null>} - Returns null on error (no entry found)
   */
  async getMonth(year, month) {
    return await new Promise((resolve) => {
      const r = this.#get().get(`${year}/${month}`);
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
   * @param {DBMonth} data
   * @returns {Promise<void>} - Returns null on error (no entry found)
   */
  async add(year, month, data) {
    return await new Promise((resolve, reject) => {
      const r = this.#set().add({ id: `${year}/${month}`, data: data });

      r.onsuccess = () => {
        if (constants.debug)
          console.log(`[DB] Add data for "${year}/${month}" was a success.`);
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
   * @param {DBMonth} data
   * @returns {Promise<void>} - Returns null on error (no entry found)
   */
  async put(year, month, data) {
    return await new Promise((resolve, reject) => {
      const r = this.#set().put({ id: `${year}/${month}`, data: data });

      r.onsuccess = () => {
        if (constants.debug)
          console.log(`[DB] Put data for "${year}/${month}" was a success.`);

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
      const r = this.#set().delete(`${year}/${month}`);
      r.onsuccess = () => {
        if (constants.debug)
          console.log(`[DB] Deleted entry for "${year}/${month}"`);

        resolve();
      };

      r.onerror = (e) => {
        if (constants.debug)
          console.log(`[DB] Deleting entry "${year}/${month}" failed!`, e);

        reject(r.error);
      };
    });
  }

  /**
   * @param {string} dbName
   * @param {number | null} version
   */
  #open(dbName, version) {
    this.#request = window.indexedDB.open(dbName, version);

    this.#request.onerror = (e) => {
      console.error(`[DBCustom] Handle request failed: ${dbName}`, e);

      // TODO: Handle error
    };

    this.#request.onblocked = (e) => {
      console.error(`[DBCustom] Handle request blocked: ${dbName}`, e);

      // TODO: Handle blocked
    };

    this.#request.onsuccess = (e) => {
      if (constants.debug)
        console.log(`[DBCustom] Handle request success: ${dbName}`, e);
    };

    this.#request.onupgradeneeded = (e) => {
      if (constants.debug)
        console.log(`[DBCustom] Handle request upgradeneeded: ${dbName}`, e);

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
