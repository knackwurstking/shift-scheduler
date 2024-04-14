import constants from "../../lib/constants";
import Page from "../page";
import innerHTML from "./inner-html";
import SwipeHandler from "./swipe-handler";
import * as utils from "./utils";

export default class CalendarPage extends Page {
  /** @type {import("../../app.js").default}*/
  #app;

  /** @type {SwipeHandler} */
  #swipeHandler;

  /** @type {(data: import("../../lib/storage").StorageDataWeekStart | null) => void|Promise<void>} */
  #onweekstart;
  /** @type {(data: Date) => void|Promise<void>} */
  #ondatepickerchange;

  /** @type {Date} */
  #today;

  /**
   * @param {import("../../app.js").default} app
   */
  constructor(app) {
    super({
      innerHTML: innerHTML,
      className: "page-calendar flex row nowrap no-user-select",
      name: "calendar",
      title: "",
    });
    this.#app = app;
    this.#updateElement();
  }

  onMount() {
    if (constants.debug) console.log("[Calendar] onMount");

    // week-start storage event
    this.#onweekstart = (data) => {
      if (constants.debug) console.log("[Calendar] update week start");
      if (data !== 0 && data !== 1) data = constants.weekStart;
      this.#updateWeekDays(data);

      // Crete days, note, shifts, ... if the week-start changes
      this.#app.appBar.datePicker.dispatchWithData(
        "datepickerchange",
        this.#app.appBar.datePicker.getDate(),
      );
    };
    this.#app.storage.addListener("week-start", this.#onweekstart);

    // datepickerchange appbar.datepicker event
    this.#ondatepickerchange = async (data) => {
      if (constants.debug) console.log("[Calendar] date picker change");

      // performance test for debugging - start
      const start = new Date().getMilliseconds();

      const date = new Date(data);
      date.setMonth(data.getMonth() - 1);

      this.#today = new Date();
      for (
        let i = 0;
        i < this.getElement().children.length;
        i++, date.setMonth(date.getMonth() + 1)
      ) {
        this.#updateItem(new Date(date), this.getElement().children[i]);
      }

      // performance test for debugging - end
      if (constants.debug)
        console.log(
          `[Calendar] updating all the (day) items took ${new Date().getMilliseconds() - start}ms`,
        );
    };
    this.#app.appBar.datePicker.addListener(
      "datepickerchange",
      this.#ondatepickerchange,
    );

    // swipe swipehandler event
    this.#swipeHandler = new SwipeHandler(this.getElement());
    this.#swipeHandler.addListener("swipe", (direction) => {
      if (constants.debug)
        console.log(`[Calendar] handle swipe to "${direction}"`);

      switch (direction) {
        case "left":
          this.#app.appBar.datePicker.nextMonth();
          break;
        case "right":
          this.#app.appBar.datePicker.prevMonth();
          break;
      }
    });

    // start swipehandler and trigger week-start event handler
    this.#swipeHandler.start();
    this.#app.storage.dispatch("week-start"); // Create week days (header and body) once
  }

  onDestroy() {
    if (constants.debug) console.log("[Calendar] onMount");

    // week-start storage event listener removal
    this.#app.storage.removeListener("week-start", this.#onweekstart);

    // datepickerchage appbar.datepicker event listener removal
    this.#app.appBar.datePicker.removeListener(
      "datepickerchange",
      this.#ondatepickerchange,
    );

    // kill the swipe handler
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
        `${this.#app.language.get("weekDays", order[x % 7].toString())}`;
    }
  }

  /**
   *  @param {Date} date
   *  @param {Element} calendarItem
   */
  async #updateItem(date, calendarItem) {
    const promise = utils.getMonthArray(
      date,
      this.#app.storage.get("week-start", constants.weekStart),
    );

    const cards = calendarItem.querySelectorAll(
      ".page-calendar-days > .ui-card",
    );
    const data = await utils.fillWithData(this.#app.db, date, await promise);
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
