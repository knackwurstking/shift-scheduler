import { component } from "ui";
import Page, { utils } from "../page";
import innerHTML from "./inner-html";

export default class SettingsPage extends Page {
  /** @type {import("../../lib/storage").default} */
  #storage;
  /** @type {import("../../lib/language").default} */
  #language;
  /** @type {import("../../components/app-bar").default} */
  #appBar;

  /** @type {component.button.Button} */
  #importBackup;
  /** @type {component.button.Button} */
  #exportBackup;

  /**
   * @param {import("../../lib/storage").default} storage
   * @param {import("../../lib/language").default} language
   * @param {import("../../components/app-bar").default} appBar
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

    this.#importBackup = new component.button.Button({
      text: "Import", // TODO: Use language
      color: "primary",
      variant: "outline",
      style: {
        width: "100%",
        height: "100%",
      },
    });
    this.#exportBackup = new component.button.Button({
      text: "Export", // TODO: Use language
      color: "primary",
      variant: "outline",
      style: {
        width: "100%",
        height: "100%",
      },
    });

    utils.replace(
      "backupTitle",
      this.#createTitle("Backup"), // TODO: Use language
      this.getElement(),
    );
    utils.replace(
      "backupImportButton",
      this.#importBackup.element,
      this.getElement(),
    );
    utils.replace(
      "backupExportButton",
      this.#exportBackup.element,
      this.getElement(),
    );
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
