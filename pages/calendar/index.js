import constants from "../../lib/constants";
import DB from "../../lib/db";
import SwipeHandler from "./swipe-handler";
import * as utils from "./utils";

/**
 * @typedef {import("../page").Page} Page
 */

const _cardContent = `
<div class="page-calendar-day-date"></div>
<div class="page-calendar-day-shift"></div>
`;

const _days = `
<div class="page-calendar-days ui-grid-row">
    <div class="ui-grid-column ui-card">${_cardContent}</div>
    <div class="ui-grid-column ui-card">${_cardContent}</div>
    <div class="ui-grid-column ui-card">${_cardContent}</div>
    <div class="ui-grid-column ui-card">${_cardContent}</div>
    <div class="ui-grid-column ui-card">${_cardContent}</div>
    <div class="ui-grid-column ui-card">${_cardContent}</div>
    <div class="ui-grid-column ui-card">${_cardContent}</div>
</div>
`;

const _itemTemplate = `
<div class="ui-grid">
    <div class="page-calendar-week-days ui-grid-row">
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
    </div>

    ${_days} ${_days} ${_days} ${_days} ${_days} ${_days}
</div>
`;

export const innerHTML = `
<div class="page-calendar-item is-max no-user-select">${_itemTemplate}</div>
<div class="page-calendar-item is-max no-user-select">${_itemTemplate}</div>
<div class="page-calendar-item is-max no-user-select">${_itemTemplate}</div>
`;

/**
 * @type {Page}
 */
export default class CalendarPage {
  /** @type {import("../../lib/storage").default}*/
  #storage;
  /** @type {import("../../lib/language").default}*/
  #language;
  /** @type {import("../../lib/app-bar").default}*/
  #appBar;

  /** @type {HTMLElement}*/
  #root;

  /** @type {DB}*/
  #db;

  /** @type {SwipeHandler} */
  #swipeHandler;

  /** @type {(data: StorageDataWeekStart | null) => void|Promise<void>} */
  #onweekstart;
  /** @type {(data: Date) => void|Promise<void>} */
  #ondatepickerchange;

  /**
   * @param {Object} option
   * @param {import("../../lib/storage").default} option.storage
   * @param {import("../../lib/language").default} option.language
   * @param {import("../../lib/app-bar").default} option.appBar
   */
  constructor({ storage, language, appBar }) {
    this.#storage = storage;
    this.#language = language;

    this.#appBar = appBar;

    // Create the root container
    this.#root = document.createElement("div");
    this.#root.style.touchAction = "none";
    this.#root.style.overflow = "hidden";
    this.#root.style.width = "100%";
    this.#root.style.height = "100%";
    this.#root.classList.add(
      "page-calendar",
      "flex",
      "row",
      "nowrap",
      "no-user-select",
    );
    this.#root.innerHTML = innerHTML;
  }

  onMount() {
    if (constants.debug) console.log("[Calendar] onMount");

    // Create the custom database (shifts and notes per day)
    if (!!this.#db) this.#db.close();
    this.#db = new DB(constants.db.name, constants.db.version);

    // Storage
    this.#onweekstart = (data) => {
      if (constants.debug) console.log("[Calendar] update week start");
      if (data !== 0 && data !== 1) data = constants.weekStart;
      this.#updateWeekDays(data);

      // Crete days, note, shifts, ... if the week-start changes
      this.#appBar.datePicker.dispatchWithData(
        "datepickerchange",
        this.#appBar.datePicker.date,
      );
    };

    this.#storage.addListener("week-start", this.#onweekstart);

    // AppBar
    this.#ondatepickerchange = async (data) => {
      if (constants.debug) console.log("[Calendar] date picker change");

      // NOTE: Perfomance testing here
      const start = new Date().getMilliseconds();

      const date = new Date(data);
      date.setMonth(data.getMonth() - 1);

      for (
        let i = 0;
        i < this.#root.children.length;
        i++, date.setMonth(date.getMonth() + 1)
      ) {
        this.#update(new Date(date), this.#root.children[i]);
      }

      // Perfomance testing here
      if (constants.debug)
        console.log(
          `[Calendar] updating all the (day) items took ${new Date().getMilliseconds() - start}ms`,
        );
    };

    this.#appBar.datePicker.addListener(
      "datepickerchange",
      this.#ondatepickerchange,
    );

    // SwipeHandler
    this.#swipeHandler = new SwipeHandler(this.#root);
    this.#swipeHandler.addListener("swipe", (direction) => {
      if (constants.debug)
        console.log(`[Calendar] handle swipe to "${direction}"`);

      switch (direction) {
        case "left":
          this.#appBar.datePicker.nextMonth();
          break;
        case "right":
          this.#appBar.datePicker.prevMonth();
          break;
      }
    });

    this.#swipeHandler.start();
    this.#storage.dispatch("week-start"); // Create week days (header and body) once
  }

  onDestroy() {
    if (constants.debug) console.log("[Calendar] onMount");

    // Storage
    this.#storage.addListener("week-start", this.#onweekstart);

    // AppBar
    this.#appBar.datePicker.removeListener(
      "datepickerchange",
      this.#ondatepickerchange,
    );

    // SwipeHandler
    this.#swipeHandler.stop();
  }

  getName() {
    return "calendar";
  }

  getTitle() {
    return "Calendar";
  }

  getContainer() {
    return this.#root;
  }

  /**
   * @param {StorageDataWeekStart} weekStart
   */
  #updateWeekDays(weekStart) {
    let order = [0, 1, 2, 3, 4, 5, 6];

    if (weekStart > 0) {
      order = [...order.slice(weekStart), ...order.slice(0, weekStart)];
    }

    const children = this.#root.querySelectorAll(
      ".page-calendar-week-days .ui-grid-column",
    );

    for (let x = 0; x < children.length; x++) {
      if (order[x] === 0 || order[x] === 6) {
        children[x].classList.add("page-calendar-weekend");
      } else {
        children[x].classList.remove("page-calendar-weekend");
      }

      children[x].innerHTML =
        `${this.#language.get("weekDays", order[x % 7].toString())}`;
    }
  }

  /**
   *  @param {Date} date
   *  @param {Element} calendarItem
   */
  async #update(date, calendarItem) {
    // TODO: get data, shifts and notes, from the database (using indexedDB if possible)
    const daysPromise = utils.getDays(
      date,
      this.#storage.get("week-start", constants.weekStart),
      this.#db,
    );

    let cards = calendarItem.querySelectorAll(".page-calendar-days > .ui-card");
    const days = await daysPromise;
    for (let i = 0; i < days.length; i++) {
      cards[i].querySelector(".page-calendar-day-date").innerHTML =
        `${date.getMonth() + 1}`;
      cards[i].querySelector(".page-calendar-day-shift").innerHTML = "Shift";
    }
  }
}
