export default class Language {
  /** @type {Languages} */
  #lang;
  /** @type {any} */
  #data;

  getLanguage() {
    return this.#lang;
  }

  /**
   * @param {string} lang
   */
  async setLanguage(lang) {
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

    return this;
  }

  /**
   * @param {LanguageDataGroups} group
   * @param {string} key
   * @returns {string}
   */
  get(group, key) {
    return this.#data?.[group][key] || "?";
  }
}
