export default class Language {
    /** @type {"en" | "de"} */
    #lang

    /**
    * @param {string} lang
    */
    constructor(lang) {
        this.changeLanguage(lang)
    }

    /**
     * @param {string} lang
     */
    changeLanguage(lang) {
        if (!!lang.match(/en/i)) {
            this.#lang = "en"
        } else if (!!lang.match(/de/i)) {
            this.#lang = "de"
        } else {
            this.#lang = "en"
        }

        return this
    }

    /**
     * @param {string} group
     * @param {string} key
     * @returns {string}
     */
    get(group, key) {
        // ...

        return "" // TODO: placeholder
    }
}
