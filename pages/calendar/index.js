import constants from "../../lib/constants";
import SwipeHandler from "./swipe-handler"

const _days = `
  <div class="page-calendar-days ui-grid-row">
    <div class="ui-grid-column ui-card"></div>
    <div class="ui-grid-column ui-card"></div>
    <div class="ui-grid-column ui-card"></div>
    <div class="ui-grid-column ui-card"></div>
    <div class="ui-grid-column ui-card"></div>
    <div class="ui-grid-column ui-card"></div>
    <div class="ui-grid-column ui-card"></div>
  </div>
`

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

  ${_days}
  ${_days}
  ${_days}
  ${_days}
  ${_days}
  ${_days}
</div>
`;

export const innerHTML = `
<div class="page-calendar-item is-max no-user-select">${_itemTemplate}</div>
<div class="page-calendar-item is-max no-user-select">${_itemTemplate}</div>
<div class="page-calendar-item is-max no-user-select">${_itemTemplate}</div>
`;

/**
 * @type {import("../page").Page}
 */
export default class CalendarPage {
  /** @type {import("../../lib/storage").default}*/
  #storage;
  /** @type {import("../../lib/language").default}*/
  #language;
  /** @type {import("../../lib/app-bar").default}*/
  #appBar

  /** @type {HTMLElement}*/
  #root;

  /** @type {SwipeHandler} */
  #swipeHandler;

  /**
   * @param {Object} option
   * @param {import("../../lib/storage").default} option.storage
   * @param {import("../../lib/language").default} option.language
   * @param {import("../../lib/app-bar").default} option.appBar
   */
  constructor({ storage, language, appBar }) {
    this.#storage = storage // NOTE: storage keys: "week-start"
    this.#language = language
    this.#appBar = appBar

    {
      // Create the root container
      this.#root = document.createElement("div");
      this.#root.style.touchAction = "none"
      this.#root.style.overflow = "hidden"
      this.#root.style.width = "100%"
      this.#root.style.height = "100%"
      this.#root.classList.add(
        "page-calendar",
        "flex",
        "row",
        "nowrap",
        "no-user-select",
      );
      this.#root.innerHTML = innerHTML;
    }

    // Setup storage handlers
    this.#setupStorageListeners()
    this.#storage.dispatch("week-start")

    // Setup swipe handlers
    this.#swipeHandler = new SwipeHandler(this.#root)
    this.#swipeHandler.addListener("swipe", (direction) => {
      console.log(`directionchange event: "${direction}"`)
      // TODO: current date -/+ on month if direction is right/left
      // TODO/NOTE: if currentDate changes - appBar listener "datepickerchange" will handle the calendar days update
    })
  }

  onMount() {
    this.#swipeHandler.start()
  }

  onDestroy() {
    this.#swipeHandler.stop()
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

  #setupStorageListeners() {
    this.#storage.addListener("week-start", (data) => {
      if (data !== 0 || data !== 1) {
        data = constants.weekStart
      }

      this.#updateWeekDays(data)
    })
  }

  /**
   * @param {number} weekStart
   */
  #updateWeekDays(weekStart) {
    let order = [0, 1, 2, 3, 4, 5, 6]

    if (weekStart > 0) {
      order = [...order.slice(weekStart), ...order.slice(0, weekStart)]
      console.log(order)
    }

    const children = this.#root.querySelectorAll(".page-calendar-week-days .ui-grid-column")

    for (let x = 0; x < children.length; x++) {
      if (order[x] === 0 || order[x] === 6) {
        children[x].classList.add("page-calendar-weekend")
      } else {
        children[x].classList.remove("page-calendar-weekend")
      }

      children[x].innerHTML = `${this.#language.get("weekDays", order[x % 7].toString())}`;
    }
  }
}
