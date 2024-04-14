import constants from "../../lib/constants";

export * as utils from "./utils";

export default class Page {
  /** @type {HTMLElement} */
  #root;
  /** @type {string} */
  #title;
  /** @type {string} */
  #name;

  /**
   * @param {Object} options
   * @param {string} [options.innerHTML]
   * @param {string} [options.className]
   * @param {string} [options.name]
   * @param {string} [options.title]
   */
  constructor({ innerHTML = "", className = "", name = "", title = "" }) {
    this.#root = document.createElement("div");
    this.#root.className = className;
    this.#root.classList.add("page");
    this.#root.innerHTML = innerHTML;

    this.#name = name;
    this.#title = title;
  }

  onMount() {
    if (constants.debug) console.log(`[${this.getName()}] onMount`);
  }

  onDestroy() {
    if (constants.debug) console.log(`[${this.getName()}] onDestroy`);
  }

  getElement() {
    return this.#root;
  }

  getName() {
    return this.#name;
  }

  getTitle() {
    return this.#title;
  }
}
