import Page, { utils } from "../page";
import innerHTML from "./inner-html";

export default class SettingsPage extends Page {
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
    super({
      innerHTML: innerHTML,
      className: "page-settings no-scrollbar",
      name: "settings",
      title: "Settings", // TODO: Use language here
    });
    this.#storage = storage;
    this.#language = language;
    this.#appBar = appBar;
    this.#updateElement();
  }

  #updateElement() {
    this.getElement().style.overflowY = "auto";
    this.getElement().style.scrollBehavior = "smooth";

    utils.replace(
      "backupTitle",
      this.#createTitle("Backup"), // TODO: Use language for "Backup"
      this.getElement(),
    );

    // TODO: replace elements here... ("backupImportButton", "backupExportButton")
  }

  /**
   * @param {string} text
   */
  #createTitle(text) {
    const e = document.createElement("span");
    e.innerHTML = text;
    return e;
  }
}
