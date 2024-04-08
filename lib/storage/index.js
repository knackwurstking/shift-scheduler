import constants from "../constants"

export default class StackLayout {
    constructor(prefix = constants.storagePrefix) {
        this.prefix = prefix
    }

    /**
     * @param {string} key
     * @param {string} data
     */
    set(key, data) {
        window.localStorage.setItem(
            this.prefix + key, JSON.stringify(data)
        )
    }

    /**
     * @param {string} key
     * @param {any} fallback
     */
    get(key, fallback = null) {
        return JSON.parse(
            window.localStorage.getItem(this.prefix + key) || "null"
        ) || fallback
    }
}
