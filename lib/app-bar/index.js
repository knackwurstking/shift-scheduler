/**
 * @typedef Groups
 * @type {"" | "calendar" | "pdf" | "settings"}
 *
 * @typedef AppBarElements
 * @type {(
 *  "backButton"|
 *  "datePicker" |
 *  "title" |
 *  "editMode" |
 *  "today" |
 *  "pdf" |
 *  "settings" | string
 * )}
 *
 * @typedef AppBarHTML
 * @type {{
 *  backButton: HTMLElement;
 *  datePicker: HTMLElement;
 *  title: HTMLElement;
 *  editMode: HTMLElement;
 *  today: HTMLElement;
 *  pdf: HTMLElement;
 *  settings: HTMLElement;
 * }}
 */

import DatePicker from "./date-picker";

export default class AppBar {
  /** @type {HTMLElement} */
  #root;

  /** @type {AppBarHTML} */
  #html

  /** @type {Groups | string} */
  #activeGroup;



  /**
   * @param {HTMLElement} root
   * @param {Groups} activeGroup
   */
  constructor(root, activeGroup) {
    this.#root = root;

    {
      const leftContainer = this.#root.querySelector(
        ".ui-app-bar-main > *:first-child",
      )
      const centerContainer = this.#root.querySelector(
        ".ui-app-bar-main > *:nth-child(2)",
      )
      const rightContainer = this.#root.querySelector(
        ".ui-app-bar-main > *:last-child",
      )

      this.#html = {
        backButton: leftContainer.querySelector(".app-bar-back-button"),
        datePicker: leftContainer.querySelector(".app-bar-date-picker"),

        title: centerContainer.querySelector(".app-bar-title"),

        editMode: rightContainer.querySelector(".app-bar-edit-mode"),
        today: rightContainer.querySelector(".app-bar-today"),
        pdf: rightContainer.querySelector(".app-bar-pdf"),
        settings: rightContainer.querySelector(".app-bar-settings"),
      }
    }

    this.datePicker = new DatePicker(new Date()) // TODO: Get date from storage

    /**
     * @type {{
     *  "": HTMLElement[];
     *  calendar: HTMLElement[];
     *  pdf: HTMLElement[];
     *  settings: HTMLElement[];
     * }}
     */
    this.groups = {
      "": [],
      calendar: [
        this.#html.datePicker,
        this.#html.editMode,
        this.#html.today,
        this.#html.pdf,
        this.#html.settings,
      ],
      pdf: [this.#html.backButton, this.#html.title],
      settings: [this.#html.backButton, this.#html.title],
    };

    this.#html.datePicker.innerText = `${this.datePicker.toMonthString()}`;
    this.setActiveGroup(activeGroup);
  }

  getActiveGroup() {
    return this.#activeGroup;
  }

  /**
   * @param {Groups | string} group
   */
  setActiveGroup(group) {
    /** @type {HTMLElement[]} */
    const newGroup = this.groups[group] || [];

    for (const g1 of [...Object.values(this.groups)]) {
      for (const g2 of g1) {
        if (newGroup.findIndex((g) => g == g2) > -1)
          g2.style.display = "block";
        else
          g2.style.display = "none";
      }
    }

    this.#activeGroup = group;
  }

  /**
   * @param {string} title
   */
  setTitle(title) {
    this.#html.title.innerText = title;
  }

  /**
   * @param {AppBarElements} name
   * @param {((el: MouseEvent & { currentTarget: HTMLElement }) => void|Promise<void>)| null} handler
   */
  onClick(name, handler) {
    this.#html[name].onclick = handler;
  }

  /**
   * @param {AppBarElements} name
   */
  click(name) {
    this.#html[name].click();
  }

  /**
   * @param {AppBarElements} name 
   */
  getElement(name) {
    return this.#html[name];
  }
}
