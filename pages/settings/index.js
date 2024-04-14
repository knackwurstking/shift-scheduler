import { component } from "ui";
import Page, { utils } from "../page";
import innerHTML from "./inner-html";
import constants from "../../lib/constants";

export default class SettingsPage extends Page {
  /** @type {import("../../app.js").default}*/
  #app;

  /** @type {component.button.Button} */
  #importBackup;
  /** @type {component.button.Button} */
  #exportBackup;

  /**
   * @param {import("../../app.js").default} app
   */
  constructor(app) {
    super({
      innerHTML: innerHTML,
      className: "page-settings no-scrollbar",
      name: "settings",
      title: "Settings", // TODO: Use language here
    });

    this.#app = app;

    this.#setup();
    this.#createMiscSection();
    this.#createShiftsSection();
    this.#createBackupSection();
    this.#createStorageSection();
  }

  #createMiscSection() {
    // ...
  }

  #createShiftsSection() {
    // ...
  }

  #createStorageSection() {
    // ...
  }

  #createBackupSection() {
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

  #setup() {
    this.getElement().style.overflowY = "auto";
    this.getElement().style.scrollBehavior = "smooth";
  }
}
