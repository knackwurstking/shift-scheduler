import constants from "../constants";

export default class StackLayout {
    /** @type {{[key: string]: ((data: any) => void|Promise<void>)}} */
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
            this.#listeners[key](data)
        }

        return this
    }

    /**
     * @param {string} key
     * @param {((data: any) => void|Promise<void>) | null} listener
     */
    addListener(key, listener) {
        if (!!this.#listeners[key]) {
            throw `a storage listener already set for "${key}", remove it before set a new one`;
        }

        this.#listeners[key] = listener;
        this.dispatch(key)

        return this
    }

    /**
     * @param {string} key
     * @returns {((data: any) => void|Promise<void>) | null}
     */
    getListener(key) {
        return this.#listeners[key] || null;
    }

    /**
     * @param {string} key
     * @returns {((data: any) => void|Promise<void>) | null}
     */
    removeListener(key) {
        const listener = this.#listeners[key]
        delete this.#listeners[key]
        return listener
    }
}
