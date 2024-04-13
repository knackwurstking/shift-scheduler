import DatePicker from "./date-picker";
import { component, svg } from "ui";

/**
 * @typedef AppBarComponents
 * @type {{
 *  backButton: component.base.IconButton;
 *  datePickerButton: component.base.Button;
 *  editButton: component.base.IconButton;
 *  todayButton: component.base.IconButton;
 *  pdfButton: component.base.IconButton;
 *  settingsButton: component.base.IconButton;
 * }}
 *
 * @typedef AppBarComponentsKeys
 * @type {(
 *  | "backButton"
 *  | "datePickerButton"
 *  | "editButton"
 *  | "todayButton"
 *  | "pdfButton"
 *  | "settingsButton"
 * )}
 *
 * @typedef AppBarEvents
 * @type {(
 *  | "datepickerchange"
 * )}
 */

export default class AppBar {
  /** @type {HTMLElement} */
  #root;

  /** @type {AppBarComponents} */
  #c;

  /** @type {DatePicker} */
  #datePicker;

  /** @type {string} */
  #group;
  /** @type {Object<string, (import("ui/src/component/base").Base)[]>} */
  #groups;

  /** @type {(date: Date) => void|Promise} */
  #ondatepickerchange;

  /**
   * @param {string| null} activeGroup
   */
  constructor(activeGroup = null) {
    this.#root = document.querySelector("header.ui-app-bar");

    /*
     * Create AppBar Components
     */

    this.#c = {
      backButton: new component.button.IconButton({
        icon: svg.BackArrowNavigation,
        color: "primary",
        ghost: true,
        id: "appBarBackButton",
      }),
      datePickerButton: new component.button.Button({
        text: "Date Picker",
        variant: "outline",
        color: "primary",
        id: "appBarDatePicker",
      }),
      editButton: new component.button.IconButton({
        icon: svg.Edit2,
        color: "primary",
        ghost: true,
        id: "appBarEditMode",
      }),
      todayButton: new component.button.IconButton({
        icon: svg.TodayOutline,
        color: "primary",
        ghost: true,
        id: "appBarToday",
      }),
      pdfButton: new component.button.IconButton({
        icon: svg.PDFDocument,
        color: "primary",
        ghost: true,
        id: "appBarPDF",
      }),
      settingsButton: new component.button.IconButton({
        icon: svg.Settings,
        color: "primary",
        ghost: true,
        id: "appBarSettings",
      }),
    };

    ((/**@type{Element}*/ container) => {
      container.appendChild(this.#c.backButton.element);
      container.appendChild(this.#c.datePickerButton.element);
    })(this.#root.querySelector("#appBarLeft"));

    ((/**@type{Element}*/ container) => {
      container.appendChild(this.#c.editButton.element);
      container.appendChild(this.#c.todayButton.element);
      container.appendChild(this.#c.pdfButton.element);
      container.appendChild(this.#c.settingsButton.element);
    })(this.#root.querySelector("#appBarRight"));

    /*
     * Setup the DatePicker
     */

    this.#datePicker = new DatePicker(new Date());
    this.#ondatepickerchange = () => {
      this.#c.datePickerButton.element.innerText =
        this.#datePicker.toMonthString();
    };
    this.#ondatepickerchange(this.datePicker.date);

    /*
     * Create Groups
     */
    this.#groups = {
      "": [],
      calendar: [
        this.#c.datePickerButton,
        this.#c.editButton,
        this.#c.todayButton,
        this.#c.pdfButton,
        this.#c.settingsButton,
      ],

      //pdf: [this.#c.backButton, this.#c.title],
      pdf: [this.#c.backButton],

      //settings: [this.#c.backButton, this.#c.title],
      settings: [this.#c.backButton],
    };

    this.#group = activeGroup || "";
  }

  get datePicker() {
    return this.#datePicker;
  }

  get group() {
    return this.#group;
  }

  /**
   * @param {string} name
   */
  set group(name) {
    const newGroup = this.#groups[name] || [];

    for (const g1 of [...Object.values(this.#groups)]) {
      for (const g2 of g1) {
        if (newGroup.findIndex((g) => g == g2) > -1)
          g2.element.style.display = "block";
        else g2.element.style.display = "none";
      }
    }

    this.#group = name;
  }

  get title() {
    return this.#root.querySelector("#appBarCenter #appBarTitle").innerHTML;
  }

  /**
   * @param {string} title - Will be set the the innerHTML
   */
  set title(title) {
    this.#root.querySelector("#appBarCenter #appBarTitle").innerHTML = title;
  }

  onMount() {
    this.datePicker.addListener("datepickerchange", this.#ondatepickerchange);
  }

  onDestroy() {
    this.datePicker.removeListener(
      "datepickerchange",
      this.#ondatepickerchange,
    );
  }

  /**
   * @param {AppBarComponentsKeys} name
   * @returns {import("ui/src/component/base").Base}
   */
  getComponent(name) {
    return this.#c[name];
  }
}
