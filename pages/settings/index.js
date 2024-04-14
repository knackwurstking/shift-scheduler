import { component } from "ui";
import Base from "ui/src/component/base/base";
import Page, { utils } from "../page";
import innerHTML from "./inner-html";

export default class SettingsPage extends Page {
  /** @type {import("../../app.js").default}*/
  #app;

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

    this.miscTitle;
    this.miscWeekStart;
    this.miscThemeMode;
    this.#createMiscSection();

    this.#createShiftsSection();

    this.backupTitle;
    this.backupImport;
    this.backupExport;
    this.#createBackupSection();

    this.#createStorageSection();

    /** @type {Base} */
    this.weekStart;
  }

  #createMiscSection() {
    this.miscTitle = new Base("span");
    this.miscTitle.innerText = "Miscellaneous"; // TODO: use language

    this.miscWeekStart = new component.text.Label({
      primary: "The week starts on Monday", // TODO: use language
      input: new Base("input", { attributes: { type: "checkbox" } }),
    });

    this.miscThemeMode = new component.text.Label({
      primary: "Theme (Mode)", // TODO: use language
      input: new component.input.Select({
        items: [
          { value: "system", label: "System", selected: true }, // TODO: get value from storage
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
        ],
      }),
    });

    utils.replace("miscTitle", this.miscTitle.element, this.getElement());
    utils.replace(
      "miscWeekStart",
      this.miscWeekStart.element,
      this.getElement(),
    );
    utils.replace(
      "miscThemeMode",
      this.miscThemeMode.element,
      this.getElement(),
    );
  }

  #createShiftsSection() {
    // ...
  }

  #createStorageSection() {
    // ...
  }

  #createBackupSection() {
    this.backupTitle = new Base("span");
    this.backupTitle.innerText = "Miscellaneous"; // TODO: use language

    this.backupImport = new component.button.Button({
      text: "Import", // TODO: Use language
      color: "primary",
      variant: "outline",
      style: {
        width: "100%",
        height: "100%",
      },
    });
    this.backupExport = new component.button.Button({
      text: "Export", // TODO: Use language
      color: "primary",
      variant: "outline",
      style: {
        width: "100%",
        height: "100%",
      },
    });

    utils.replace("backupTitle", this.backupTitle.element, this.getElement());
    utils.replace(
      "backupImportButton",
      this.backupImport.element,
      this.getElement(),
    );
    utils.replace(
      "backupExportButton",
      this.backupExport.element,
      this.getElement(),
    );
  }

  #setup() {
    this.getElement().style.overflowY = "auto";
    this.getElement().style.scrollBehavior = "smooth";
  }
}
