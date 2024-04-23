/**
 * @typedef LanguageDataGroups
 * @type {(
 *  | "calendar"
 *  | "settings"
 * )}
 */

export class Language {
    /** @type {import("../../types").LangStore} */
    #lang;
    /** @type {any} */
    #data;

    /** @param {import("ui/src/wc").Store} store */
    constructor(store) {
        this.store = store;
    }

    getLanguage() {
        return this.#lang;
    }

    /**
     * @param {string} lang
     */
    async setLanguage(lang) {
        if (lang === this.#lang) return;

        if (!!lang.match(/en/i)) {
            this.#lang = "en";
        } else if (!!lang.match(/de/i)) {
            this.#lang = "de";
        } else {
            this.#lang = "en";
        }

        const request = await fetch(`/lang/${this.#lang}.json`);
        this.#data = await request.json();

        this.store.data.set("lang", this.#lang);

        return this;
    }

    /**
     * @param {LanguageDataGroups} group
     * @param {string} key
     * @returns {string}
     */
    get(group, key) {
        return this.#data?.[group][key] || "";
    }
}
