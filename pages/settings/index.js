import innerHTML from "./inner-html";

/**
 * @type {import("../page").Page}
 */
export default class SettingsPage {
  /** @type {HTMLElement} */
  #root;

  /** @type {import("../../lib/storage").default} */
  #storage;
  /** @type {import("../../lib/language").default} */
  #language;
  /** @type {import("../../lib/app-bar").default} */
  #appBar;

  /**
   * @param {import("../../lib/storage").default} storage
   * @param {import("../../lib/language").default} language
   * @param {import("../../lib/app-bar").default} appBar
   */
  constructor(storage, language, appBar) {
    this.#storage = storage;
    this.#language = language;
    this.#appBar = appBar;

    this.#root = this.#createRoot(document.createElement("div"));
  }

  /**
   * @param {HTMLElement} container
   */
  #createRoot(container) {
    container.classList.add("page-settings");
    container.classList.add("no-scrollbar");
    container.style.overflowY = "auto";
    container.style.scrollBehavior = "smooth";
    container.style.width = "100%";

    container.innerHTML = innerHTML;

    return container;
  }
}
