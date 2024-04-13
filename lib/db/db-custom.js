import constants from "../constants";

/**
 * @typedef DBCustomDataShift
 * @type {{
 *  id: number;
 *  name: string;
 *  shortName: string;
 *  visible: boolean;
 *  color?: string;
 * }}
 *
 * @typedef DBCustomData
 * @type {{
 *  date: Date;
 *  shift: DBCustomDataShift | null;
 *  note: string;
 * }}
 */

export default class DBCustom {
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
   * @returns {DBCustomData[]}
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
      console.error(`Handle request failed: ${dbName}`, e);

      // TODO: Handle error
    };

    this.#request.onblocked = (e) => {
      console.error(`Handle request blocked: ${dbName}`, e);

      // TODO: Handle blocked
    };

    this.#request.onsuccess = (e) => {
      if (constants.debug) console.log(`Handle request success: ${dbName}`, e);

      // TODO: Handle success
    };

    this.#request.onupgradeneeded = (e) => {
      if (constants.debug)
        console.log(`Handle request upgradeneeded: ${dbName}`, e);

      // TODO: Handle upgradeneeded
    };
  }
}
