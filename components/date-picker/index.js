import { events, component } from "ui";

/**
 * @typedef EventTypes
 * @type {(
 *  | "datepickerchange"
 * )}
 */

export default class DatePicker extends events.Events {
  /** @type {Date} */
  #date;

  /**
   */
  constructor() {
    super();
    /** @type {component.button.Button} */
    this.button;
    this.#setup();
  }

  onMount() {
    this.button.element.onclick = () => {
      // TODO: Open date picker dialog
    };

    return this;
  }

  onDestroy() {
    this.button.element.onclick = null;

    return this;
  }

  getDate() {
    return this.#date;
  }

  /** @param {Date} date */
  setDate(date) {
    this.#date = date;
    return this.#update();
  }

  nextMonth() {
    this.#date.setMonth(this.#date.getMonth() + 1);
    this.#update();

    return this;
  }

  prevMonth() {
    this.#date.setMonth(this.#date.getMonth() - 1);
    this.#update();

    return this;
  }

  toMonthString() {
    return `${this.#date.getFullYear()} / ${(this.#date.getMonth() + 1).toString().padStart(2, "0")}`;
  }

  /**
   * @param {EventTypes} type
   * @param {any} data
   */
  dispatchWithData(type, data) {
    super.dispatchWithData(type, data);
    return this;
  }

  /**
   * @param {EventTypes} type
   * @param {(data: any) => void|Promise<void>} listener
   * @returns (() => void) - clean up function
   */
  addListener(type, listener) {
    return super.addListener(type, listener);
  }

  /**
   * @param {EventTypes} type
   * @param {(data: any) => void|Promise<void>} listener
   */
  removeListener(type, listener) {
    super.addListener(type, listener);
    return this;
  }

  #update() {
    this.button.innerHTML = this.toMonthString();
    this.dispatchWithData("datepickerchange", this.#date);

    return this;
  }

  #setup() {
    this.button = new component.button.Button({
      text: "Date Picker",
      variant: "outline",
      color: "primary",
      id: "appBarDatePicker",
    });
    this.#date = new Date();
    this.#update();

    return this;
  }
}
