import DatePicker from "./date-picker";

export default class AppBar {
  /** @type {HTMLElement} */
  #root;

  /** @type {AppBarHTML} */
  #html

  /** @type {DatePicker} */
  #datePicker

  /** @type {AppBarGroupKeys | string} */
  #group;

  /** @type {(date: Date) => void|Promise} */
  #ondatepickerchange

  /**
   * @param {HTMLElement} root
   * @param {AppBarGroupKeys | null} group 
   */
  constructor(root, group = null) {
    this.#root = root;

    {
      // Query selector calls
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

    // Initialize the DatePicker
    this.#datePicker = new DatePicker(new Date()) // TODO: Get the last used date from storage

    this.#ondatepickerchange = () => {
      this.#html.datePicker.innerText = this.#datePicker.toMonthString();
    }
    this.#ondatepickerchange(this.datePicker.date)

    // AppBar groups
    /** @type {AppBarGroups} */
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

    this.#group = group || ""
  }

  get datePicker() {
    return this.#datePicker
  }

  get group() {
    return this.#group
  }

  /**
   * @param {AppBarGroupKeys | string} name
   */
  set group(name) {
    /** @type {HTMLElement[]} */
    const newGroup = this.groups[name] || [];

    for (const g1 of [...Object.values(this.groups)]) {
      for (const g2 of g1) {
        if (newGroup.findIndex((g) => g == g2) > -1)
          g2.style.display = "block";
        else
          g2.style.display = "none";
      }
    }

    this.#group = name;
  }

  get title() {
    return this.#html.title.innerText
  }

  /**
   * @param {string} title
   */
  set title(title) {
    this.#html.title.innerText = title
  }

  onMount() {
    this.datePicker.addListener("datepickerchange", this.#ondatepickerchange)
  }

  onDestroy() {
    this.datePicker.removeListener("datepickerchange", this.#ondatepickerchange)
  }

  /**
   * @param {AppBarElements} name 
   * @returns {HTMLElement}
   */
  getElement(name) {
    return this.#html[name];
  }
}
