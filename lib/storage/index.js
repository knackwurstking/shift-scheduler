import constants from "../constants"

export default (() => {
    function set(key, data) {
        window.localStorage.setItem(constants.storagePrefix + key, data)
    }

    function get(key, fallback = null) {
        return window.localStorage.getItem(constants.storagePrefix + key) || fallback
    }

    return {
        set, get
    }
})()
