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

    /** @type {HTMLElement}*/
    #container;

    /** @type {SwipeHandler} */
    #swipeHandler;

    /**
     * @param {import("../../lib/storage").default} storage
     * @param {import("../../lib/language").default} language
     */
    constructor(storage, language) {
        this.#storage = storage
        this.#language = language

        this.#container = document.createElement("div");
        this.#container.style.touchAction = "none"
        this.#container.style.overflow = "hidden"
        this.#container.style.width = "100%"
        this.#container.style.height = "100%"
        this.#container.classList.add(
            "page-calendar",
            "flex",
            "row",
            "nowrap",
            "no-user-select",
        );
        this.#container.innerHTML = innerHTML;

        this.#setupStorageListeners()
        this.#storage.dispatch("week-start")

        this.#swipeHandler = new SwipeHandler(this.#container)
        // TODO: after a swipe (left/right, "none" can be ignored) listen for a
        //       "directionchange" event and update the currentDate and days
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
        return this.#container;
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

        const children = this.#container.querySelectorAll(".page-calendar-week-days .ui-grid-column")

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
