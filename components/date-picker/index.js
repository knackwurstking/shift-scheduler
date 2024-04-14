import { events } from "ui";

export default class DatePicker extends events.Events {
  /** @type {Date} */
  #date;

  /**
   * @param {Date} date
   */
  constructor(date) {
    super();
    this.#date = date;
  }

  get date() {
    return this.#date;
  }

  set date(date) {
    this.#date = date;
    this.dispatchWithData("datepickerchange", this.date);
  }

  nextMonth() {
    this.#date.setMonth(this.#date.getMonth() + 1);
    this.dispatchWithData("datepickerchange", this.date);
  }

  prevMonth() {
    this.#date.setMonth(this.#date.getMonth() - 1);
    this.dispatchWithData("datepickerchange", this.date);
  }

  toMonthString() {
    return `${this.date.getFullYear()} / ${(this.date.getMonth() + 1).toString().padStart(2, "0")}`;
  }

  /**
   * @param {import("..").AppBarEvents} type
   * @param {any} data
   */
  dispatchWithData(type, data) {
    super.dispatchWithData(type, data);
    return this;
  }

  /**
   * @param {import("..").AppBarEvents} type
   * @param {(data: any) => void|Promise<void>} listener
   * @returns (() => void) - clean up function
   */
  addListener(type, listener) {
    return super.addListener(type, listener);
  }

  /**
   * @param {import("..").AppBarEvents} type
   * @param {(data: any) => void|Promise<void>} listener
   */
  removeListener(type, listener) {
    super.addListener(type, listener);
    return this;
  }
}
