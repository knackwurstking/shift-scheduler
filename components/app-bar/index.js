import SettingsPage from "../../pages/settings";
import DatePicker from "../date-picker";
import { component, svg } from "ui";

export default class AppBar {
  /** @type {HTMLElement} */
  #root;
  /** @type {string} */
  #group;

  /** @type {import("../../app.js").default} */
  #app;

  /**
   * @param {import("../../app.js").default} app
   * @param {string| null} activeGroup
   */
  constructor(app, activeGroup = null) {
    this.#app = app;
    this.#root = document.querySelector("header.ui-app-bar");

    /** @type {component.button.IconButton} */
    this.back;
    /** @type {DatePicker} */
    this.datePicker;
    /** @type {component.button.IconButton} */
    this.edit;
    /** @type {component.button.IconButton} */
    this.today;
    /** @type {component.button.IconButton} */
    this.pdf;
    /** @type {component.button.IconButton} */
    this.settings;
    this.#setupComponents();

    /** @type {Object<string, (component.base.Button | component.base.IconButton)[]>} */
    this.groups = {
      "": [],
      calendar: [
        this.datePicker.button,
        this.edit,
        this.today,
        this.pdf,
        this.settings,
      ],

      //pdf: [this.#c.backButton, this.#c.title],
      pdf: [this.back],

      //settings: [this.#c.backButton, this.#c.title],
      settings: [this.back],
    };

    this.setGroup(activeGroup);
  }

  onMount() {
    this.back.element.onclick = () => {
      // ...
    };

    this.edit.element.onclick = () => {
      // Add the edit mode (footer), dont forget to apply the class ".edit-mode" to the main container
    };

    this.today.element.onclick = () => {
      // The date picker will than dispatch the event for the calendar page
      this.datePicker.setDate(new Date());
    };

    this.pdf.element.onclick = () => {
      // ...
    };

    this.settings.element.onclick = () => {
      // TODO: Go to settings page (using the stack layout)
      this.#app.stack.setPage(new SettingsPage(this.#app));
    };

    return this;
  }

  onDestroy() {
    this.back.element.onclick = null;
    this.edit.element.onclick = null;
    this.today.element.onclick = null;
    this.pdf.element.onclick = null;
    this.settings.element.onclick = null;

    return this;
  }

  getGroup() {
    return this.#group;
  }

  /**
   * @param {string} name
   */
  setGroup(name) {
    const newGroup = this.groups[name] || [];

    for (const g1 of [...Object.values(this.groups)]) {
      for (const g2 of g1) {
        if (newGroup.findIndex((g) => g == g2) > -1)
          g2.element.style.display = "block";
        else g2.element.style.display = "none";
      }
    }

    this.#group = name;
  }

  getTitle() {
    return this.#root.querySelector("#appBarCenter #appBarTitle").innerHTML;
  }

  /**
   * @param {string} title - Will be set the the innerHTML
   */
  setTitle(title) {
    this.#root.querySelector("#appBarCenter #appBarTitle").innerHTML = title;
  }

  #setupComponents() {
    this.back = new component.button.IconButton({
      icon: svg.BackArrowNavigation,
      color: "primary",
      ghost: true,
      id: "appBarBackButton",
    });

    this.datePicker = new DatePicker();

    this.edit = new component.button.IconButton({
      icon: svg.Edit2,
      color: "primary",
      ghost: true,
      id: "appBarEditMode",
    });

    this.today = new component.button.IconButton({
      icon: svg.TodayOutline,
      color: "primary",
      ghost: true,
      id: "appBarToday",
    });

    this.pdf = new component.button.IconButton({
      icon: svg.PDFDocument,
      color: "primary",
      ghost: true,
      id: "appBarPDF",
    });

    this.settings = new component.button.IconButton({
      icon: svg.Settings,
      color: "primary",
      ghost: true,
      id: "appBarSettings",
    });

    const leftSlot = this.#root.querySelector("#appBarLeft");
    leftSlot.appendChild(this.back.element);
    leftSlot.appendChild(this.datePicker.button.element);

    const rightSlot = this.#root.querySelector("#appBarRight");
    rightSlot.appendChild(this.edit.element);
    rightSlot.appendChild(this.today.element);
    rightSlot.appendChild(this.pdf.element);
    rightSlot.appendChild(this.settings.element);
  }
}
