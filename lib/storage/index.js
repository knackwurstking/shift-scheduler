import constants from "../constants";

/**
 * @typedef Keys
 * @type {"theme" | "lang"}
 *
 * @typedef ThemeData
 * @type {{ mode: (("dark" | "light") | null) }}
 */

export default class StackLayout {
    /** @type {{[key: string]: ((data: any) => void|Promise<void>)[]}} */
    #listeners;

    constructor(prefix = constants.storagePrefix) {
        this.prefix = prefix;

        this.#listeners = {};
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
     * @param {any} data
     */
    dispatch(key, data) {
        if (!!this.#listeners[key]) {
            for (const listener of this.#listeners[key]) {
                listener[key](data)
            }
        }

        return this
    }

    /**
     * @param {Keys} key
     * @param {((data: any) => void|Promise<void>) | null} listener
     * @returns {() => void} clean up function
     */
    addListener(key, listener) {
        if (!this.#listeners[key]) {
            this.#listeners[key] = []
        }

        this.#listeners[key].push(listener);

        return (() => {
            this.removeListener(key, listener)
        })
    }

    /**
     * @param {Keys} key
     * @param {((data: any) => void|Promise<void>)} listener
     * @returns {((data: any) => void|Promise<void>) | null}
     */
    removeListener(key, listener) {
        if (!this.#listeners[key]) return

        let index = 0
        for (const l of this.#listeners[key]) {
            if (l === listener) {
                this.#listeners[key].splice(index, 1)
            }
            index++
        }

        return listener
    }
}
