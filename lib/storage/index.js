import constants from "../constants";
import { events } from "ui"

/**
 * @typedef Keys
 * @type {"theme" | "lang" | "week-start"}
 *
 * @typedef ThemeData
 * @type {{ mode: (("dark" | "light") | null) }}
 *
 * @typedef LangData
 * @type {"de" | "en"}
 *
 * @typedef FirstWeekDayData
 * @type {0 | 1}
 */

export default class StackLayout extends events.Events {
  constructor(prefix = constants.storagePrefix) {
    super()
    this.prefix = prefix;
  }

  /**
   * @param {Keys} key
   * @param {string} data
   */
  set(key, data) {
    window.localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  /**
   * @param {Keys} key
   * @param {any} fallback
   */
  get(key, fallback = null) {
    return (
      JSON.parse(window.localStorage.getItem(this.prefix + key) || "null") ||
      fallback
    );
  }

  /**
   * @param {Keys} key
   */
  dispatch(key) {
    super.dispatchWithData(key, this.get(key))
    return this
  }

  /**
   * @param {Keys} key
   * @param {any} data
   */
  dispatchWithData(key, data) {
    super.dispatchWithData(key, data)
    return this
  }

  /**
   * @param {Keys} key
   * @param {((data: any) => void|Promise<void>)} listener 
   * @returns {() => void} clean up function
   */
  addListener(key, listener) {
    return super.addListener(key, listener)
  }

  /**
   * @param {Keys} key
   * @param {((data: any) => void|Promise<void>)} listener 
   */
  removeListener(key, listener) {
    super.addListener(key, listener)
    return this
  }
}
