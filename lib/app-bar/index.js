export default class AppBar {
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

  /**
   * @param {HTMLElement} container
   * @param {import("../date-picker").default} datePicker
   */
  constructor(container, datePicker) {
    this.container = container;
    this.datePicker = datePicker;

    this.#leftContainer = this.container.querySelector(
      ".ui-app-bar-main > *:first-child",
    );
    this.#centerContainer = this.container.querySelector(
      ".ui-app-bar-main > *:nth-child(2)",
    );
    this.#rightContainer = this.container.querySelector(
      ".ui-app-bar-main > *:last-child",
    );

    this.#backButton = this.#leftContainer.querySelector(
      ".app-bar-back-button",
    );

    this.#datePicker = this.#leftContainer.querySelector(
      ".app-bar-date-picker",
    );
    this.#datePicker.innerText = `${this.datePicker.toMonthString()}`;

    this.#title = this.#centerContainer.querySelector(".app-bar-title");

    this.#editMode = this.#rightContainer.querySelector(".app-bar-edit-mode");
    this.#today = this.#rightContainer.querySelector(".app-bar-today");
    this.#pdf = this.#rightContainer.querySelector(".app-bar-pdf");
    this.#settings = this.#rightContainer.querySelector(".app-bar-settings");
  }

  /**
   * @param {string} title
   */
  setTitle(title) {
    this.#title.innerText = title;
  }
}
