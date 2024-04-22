import constants from "../constants";
import ui from "ui";

/**
 * @typedef StorageKeys
 * @type {(
 *  | "theme"
 *  | "lang"
 *  | "week-start"
 *  | "settings"
 * )}
 *
 * @typedef StorageDataWeekStart
 * @type {0 | 1}
 *
 * @typedef StorageDataLang
 * @type {import("../language").Languages}
 *
 * @typedef StorageDataTheme
 * @type {{ mode: ("system" | "dark" | "light"), name: "zinc" }}
 *
 * @typedef StorageDataSettings
 * @type {import("../../types").Settings}
 */

export class Storage extends ui.events.Events {
    constructor(prefix = constants.storagePrefix) {
        super(constants.debug);
        this.prefix = prefix;
    }

    /**
     * @param {StorageKeys} key
     * @param {any} data
     */
    set(key, data) {
        window.localStorage.setItem(this.prefix + key, JSON.stringify(data));
    }

    /**
     * @param {StorageKeys} key
     * @param {any} fallbackData
     * @returns {any}
     */
    get(key, fallbackData) {
        return (
            JSON.parse(
                window.localStorage.getItem(this.prefix + key) || "null",
            ) || fallbackData
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
        super.removeListener(key, listener);
        return this;
    }
}
