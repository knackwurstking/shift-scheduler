import constants from "../../lib/constants";
import DB from "../../lib/db";
import Page from "../page";
import innerHTML from "./inner-html";
import SwipeHandler from "./swipe-handler";
import * as utils from "./utils";

export default class CalendarPage extends Page {
  /** @type {import("../../lib/storage").default}*/
  #storage;
  /** @type {import("../../lib/language").default}*/
  #language;
  /** @type {import("../../components/app-bar").default}*/
  #appBar;

  /** @type {DB}*/
  #db;

  /** @type {SwipeHandler} */
  #swipeHandler;

  /** @type {(data: import("../../lib/storage").StorageDataWeekStart | null) => void|Promise<void>} */
  #onweekstart;
  /** @type {(data: Date) => void|Promise<void>} */
  #ondatepickerchange;

  /** @type {Date} */
  #today;

  /**
   * @param {import("../../lib/storage").default} storage
   * @param {import("../../lib/language").default} language
   * @param {import("../../components/app-bar").default} appBar
   */
  constructor(storage, language, appBar) {
    super({
      innerHTML: innerHTML,
      className: "page-calendar flex row nowrap no-user-select",
      name: "calendar",
      title: "",
    });
    this.#storage = storage;
    this.#language = language;
    this.#appBar = appBar;
    this.#updateElement();
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
        this.#appBar.datePicker.getDate(),
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

      this.#today = new Date();
      for (
        let i = 0;
        i < this.getElement().children.length;
        i++, date.setMonth(date.getMonth() + 1)
      ) {
        this.#update(new Date(date), this.getElement().children[i]);
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
    this.#swipeHandler = new SwipeHandler(this.getElement());
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

  /**
   * @param {import("../../lib/storage").StorageDataWeekStart} weekStart
   */
  #updateWeekDays(weekStart) {
    let order = [0, 1, 2, 3, 4, 5, 6];

    if (weekStart > 0) {
      order = [...order.slice(weekStart), ...order.slice(0, weekStart)];
    }

    const children = this.getElement().querySelectorAll(
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
    const promise = utils.getMonthArray(
      date,
      this.#storage.get("week-start", constants.weekStart),
    );

    const cards = calendarItem.querySelectorAll(
      ".page-calendar-days > .ui-card",
    );
    const data = await utils.fillWithData(this.#db, date, await promise);
    for (let i = 0; i < data.length; i++) {
      if (this.#isNope(data[i].date, date)) cards[i].classList.add("nope");
      else cards[i].classList.remove("nope");

      if (this.#isToday(data[i].date)) cards[i].classList.add("today");
      else cards[i].classList.remove("today");

      if (!!data[i].note) cards[i].classList.add("note");
      else cards[i].classList.remove("note");

      cards[i].querySelector(".page-calendar-day-date").innerHTML =
        `${data[i].date.getDate()}`;

      cards[i].querySelector(".page-calendar-day-shift").innerHTML = !!data[i]
        .shift?.visible
        ? data[i].shift?.shortName || ""
        : "";
    }
  }

  /**
   * @param {Date} date
   */
  #isToday(date) {
    return (
      this.#today.getFullYear() === date.getFullYear() &&
      this.#today.getMonth() === date.getMonth() &&
      this.#today.getDate() === date.getDate()
    );
  }

  /**
   * @param {Date} d1
   * @param {Date} d2
   */
  #isNope(d1, d2) {
    return (
      d1.getFullYear() !== d2.getFullYear() || d1.getMonth() !== d2.getMonth()
    );
  }

  #updateElement() {
    this.getElement().style.touchAction = "none";
    this.getElement().style.overflow = "hidden";
  }
}
