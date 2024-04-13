import { events } from "ui";
import constants from "../constants";

/**
 * @typedef StorageKeys
 * @type {(
 *  | "theme"
 *  | "lang"
 *  | "week-start"
 * )}
 */

export default class Storage extends events.Events {
  // TODO: Write some @overloads for every method using any type

  constructor(prefix = constants.storagePrefix) {
    super();
    this.prefix = prefix;
  }

  /**
   * @param {StorageKeys} key
   * @param {string} data
   */
  set(key, data) {
    window.localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  /**
   * @overload
   * @param {"theme"} key
   * @param {StorageDataTheme | null} [fallback]
   * @returns {StorageDataTheme | null}
   */

  /**
   * @overload
   * @param {"lang"} key
   * @param {StorageDataLang | null} [fallback]
   * @returns {StorageDataLang | null}
   */

  /**
   * @overload
   * @param {"week-start"} key
   * @param {StorageDataWeekStart | null} [fallback]
   * @returns {StorageDataWeekStart | null}
   */

  /**
   * @param {string} key
   * @param {any} [fallback]
   * @returns {any}
   */
  get(key, fallback = null) {
    return (
      JSON.parse(window.localStorage.getItem(this.prefix + key) || "null") ||
      fallback
    );
  }

  /**
   * @param {StorageKeys} key
   */
  dispatch(key) {
    super.dispatchWithData(key, this.get(key));
    return this;
  }

  /**
   * @param {StorageKeys} key
   * @param {any} data
   */
  dispatchWithData(key, data) {
    if (constants.debug) console.log(`[storage] "${key}"`, data);
    super.dispatchWithData(key, data);
    return this;
  }

  /**
   * @param {StorageKeys} key
   * @param {((data: any) => void|Promise<void>)} listener
   * @returns {() => void} clean up function
   */
  addListener(key, listener) {
    return super.addListener(key, listener);
  }

  /**
   * @param {StorageKeys} key
   * @param {((data: any) => void|Promise<void>)} listener
   */
  removeListener(key, listener) {
    super.addListener(key, listener);
    return this;
  }
}
