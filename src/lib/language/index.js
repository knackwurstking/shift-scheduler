/**
 * @typedef Languages
 * @type {"en" | "de"}
 *
 * @typedef LanguageDataGroups
 * @type {(
 *  | "calendar"
 *  | "settings"
 * )}
 */

// TODO: html file now contains per default english, just update all strings for german if needed
export class Language {
    /** @type {import("../../app").App} */
    #app;
    /** @type {Languages} */
    #lang;
    /** @type {any} */
    #data;

    /** @param {import("../../app").App} app */
    constructor(app) {
        this.#app = app;
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
        const data = await request.json();
        this.#data = data;

        this.#app.storage.dispatch("lang");

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
