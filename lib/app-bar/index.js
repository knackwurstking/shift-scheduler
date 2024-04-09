/**
 * @typedef Groups
 * @type {"" | "calendar" | "pdf" | "settings"}
 *
 * @typedef OnClickElements
 * @type {"back-button"| "date-picker" | "edit-mode" | "pdf" | "settings"}
 */

export default class AppBar {
  #activeGroup;

  #leftContainer;
  #centerContainer;
  #rightContainer;

  #backButton; // icon button
  #datePicker; // button (year / month)

  #title; // app title

  #editMode; // icon button
  #today; // icon button
  #pdf; // icon button
  #settings; // icon button

  #onClickHandlers;

  /**
   * @param {HTMLElement} container
   * @param {import("../date-picker").default} datePicker
   * @param {Groups} activeGroup
   */
  constructor(container, datePicker, activeGroup) {
    this.container = container;
    this.datePicker = datePicker;

    /** @type {HTMLElement | null} */
    this.#leftContainer = this.container.querySelector(
      ".ui-app-bar-main > *:first-child",
    );
    /** @type {HTMLElement | null} */
    this.#centerContainer = this.container.querySelector(
      ".ui-app-bar-main > *:nth-child(2)",
    );
    /** @type {HTMLElement | null} */
    this.#rightContainer = this.container.querySelector(
      ".ui-app-bar-main > *:last-child",
    );

    /** @type {HTMLElement | null} */
    this.#backButton = this.#leftContainer.querySelector(
      ".app-bar-back-button",
    );

    /** @type {HTMLElement | null} */
    this.#datePicker = this.#leftContainer.querySelector(
      ".app-bar-date-picker",
    );
    this.#datePicker.innerText = `${this.datePicker.toMonthString()}`;

    /** @type {HTMLElement | null} */
    this.#title = this.#centerContainer.querySelector(".app-bar-title");

    /** @type {HTMLElement | null} */
    this.#editMode = this.#rightContainer.querySelector(".app-bar-edit-mode");
    /** @type {HTMLElement | null} */
    this.#today = this.#rightContainer.querySelector(".app-bar-today");
    /** @type {HTMLElement | null} */
    this.#pdf = this.#rightContainer.querySelector(".app-bar-pdf");
    /** @type {HTMLElement | null} */
    this.#settings = this.#rightContainer.querySelector(".app-bar-settings");

    this.#onClickHandlers = {
      "back-button": this.#backButton,
      "date-picker": this.#datePicker,
      "edit-mode": this.#editMode,
      pdf: this.#pdf,
      settings: this.#settings,
    };

    this.groups = {
      "": [],
      calendar: [
        this.#datePicker,
        this.#editMode,
        this.#today,
        this.#pdf,
        this.#settings,
      ],
      pdf: [this.#backButton, this.#title],
      settings: [this.#backButton, this.#title],
    };
    this.setActiveGroup(activeGroup);
  }

  getActiveGroup() {
    return this.#activeGroup;
  }

  /**
   * @param {Groups} group
   */
  setActiveGroup(group) {
    const newGroup = this.groups[group] || [];
    for (const g1 of [...Object.values(this.groups)]) {
      for (const g2 of g1) {
        if (newGroup.findIndex((g) => g == g2) > -1) g2.style.display = "block";
        else g2.style.display = "none";
      }
    }

    this.#activeGroup = group;
  }

  /**
   * @param {string} title
   */
  setTitle(title) {
    this.#title.innerText = title;
  }

  /**
   * @param {OnClickElements} el
   * @param {((el: HTMLElement) => void|Promise<void>)| null} handler
   */
  onClick(el, handler) {
    this.#onClickHandlers[el].onclick = handler;
  }

  /**
   * @param {OnClickElements} el
   */
  getClickHandler(el) {
    return this.#onClickHandlers[el].onclick;
  }

  /**
   * @param {OnClickElements} el
   */
  click(el) {
    this.#onClickHandlers[el].click();
  }
}
