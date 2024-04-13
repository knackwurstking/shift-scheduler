import constants from "../constants";

/**
 * @typedef DBShift
 * @type {import(".").DBShift}
 *
 * @typedef DBDay
 * @type {import(".").DBDay}
 *
 * @typedef DBMonth
 * @type {import(".").DBMonth}
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

  /**
   * @param {string | number} key
   * @returns {DBMonth}
   */
  getData(key) {
    // ...

    return [];
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

      // TODO: Handle success
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
    if (db.objectStoreNames.contains("months"))
      db.createObjectStore("months", {
        autoIncrement: false,
        keyPath: "id",
      });
  }
}
