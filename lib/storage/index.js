import constants from "../constants";

export default class StackLayout {
    /** @type {{[key: string]: ((data: any) => void|Promise<void>)[]}} */
    #listeners;

    constructor(prefix = constants.storagePrefix) {
        this.prefix = prefix;

        this.#listeners = {};
    }

    /**
     * @param {string} key
     * @param {string} data
     */
    set(key, data) {
        window.localStorage.setItem(this.prefix + key, JSON.stringify(data));
    }

    /**
     * @param {string} key
     * @param {any} fallback
     */
    get(key, fallback = null) {
        return (
            JSON.parse(window.localStorage.getItem(this.prefix + key) || "null") ||
            fallback
        );
    }

    /**
     * @param {string} key
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
     * @param {string} key
     * @param {((data: any) => void|Promise<void>) | null} listener
     * @returns {() => void} clean up function
     */
    addListener(key, listener) {
        if (!this.#listeners[key]) {
            this.#listeners[key] = []
        }

        this.#listeners[key].push(listener);
        listener(this.get(key))

        return (() => {
            this.removeListener(key, listener)
        })
    }

    /**
     * @param {string} key
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
