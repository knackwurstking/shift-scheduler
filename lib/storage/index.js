import constants from "../constants";
import { events } from "ui"

export default class StackLayout extends events.Events {
  constructor(prefix = constants.storagePrefix) {
    super()
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
   * @param {StorageKeys} key
   * @param {any} fallback
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
    super.dispatchWithData(key, this.get(key))
    return this
  }

  /**
   * @param {StorageKeys} key
   * @param {any} data
   */
  dispatchWithData(key, data) {
    console.log(`[storage] "${key}"`, data)
    super.dispatchWithData(key, data)
    return this
  }

  /**
   * @param {StorageKeys} key
   * @param {((data: any) => void|Promise<void>)} listener 
   * @returns {() => void} clean up function
   */
  addListener(key, listener) {
    return super.addListener(key, listener)
  }

  /**
   * @param {StorageKeys} key
   * @param {((data: any) => void|Promise<void>)} listener 
   */
  removeListener(key, listener) {
    super.addListener(key, listener)
    return this
  }
}
