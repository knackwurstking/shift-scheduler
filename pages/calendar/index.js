import constants from "../../lib/constants";

export const innerHTML = `
<div
  class="page-calendar-item is-max no-user-select"
></div>

<div
  class="page-calendar-item is-max no-user-select"
></div>

<div
  class="page-calendar-item is-max no-user-select"
></div>
`;

export const itemTemplate = `
<div class="ui-grid is-max">
  <div class="page-calendar-week-days ui-grid-row">
    <!-- One for each day in a week -->
    <div class="ui-grid-column ui-card has-padding is-text-center"></div>
    <div class="ui-grid-column ui-card has-padding is-text-center"></div>
    <div class="ui-grid-column ui-card has-padding is-text-center"></div>
    <div class="ui-grid-column ui-card has-padding is-text-center"></div>
    <div class="ui-grid-column ui-card has-padding is-text-center"></div>
    <div class="ui-grid-column ui-card has-padding is-text-center"></div>
    <div class="ui-grid-column ui-card has-padding is-text-center"></div>
  </div>

  <!-- TODO: Continue building the grid here (size: 7x6) -->
  <div class="page-calendar-days ui-grid-row is-max-height">
    <div class="ui-grid-column"></div>
  </div>
  <div class="page-calendar-days ui-grid-row is-max-height">
  </div>
  <div class="page-calendar-days ui-grid-row is-max-height">
  </div>
  <div class="page-calendar-days ui-grid-row is-max-height">
  </div>
  <div class="page-calendar-days ui-grid-row is-max-height">
  </div>
  <div class="page-calendar-days ui-grid-row is-max-height">
  </div>
</div>
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

    /**
     * @param {import("../../lib/storage").default} storage
     * @param {import("../../lib/language").default} language
     */
    constructor(storage, language) {
        this.#storage = storage
        this.#language = language

        this.#container = document.createElement("div");
        this.#container.classList.add(
            "page-calendar",
            "flex",
            "row",
            "nowrap",
            "is-max",
            "no-touch",
            "no-overflow",
            "no-user-select",
        );
        this.#container.innerHTML = innerHTML;

        this.#setupStorageListeners()
        this.#storage.dispatch("week-start")
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

            for (const el of this.#container.querySelectorAll(".page-calendar-item")) {
                el.innerHTML = itemTemplate;
                this.#updateWeekDays(el, data);
            }
        })
    }

    /**
     * @param {Element} el
     * @param {number} weekStart
     */
    #updateWeekDays(el, weekStart) {
        let order = [0, 1, 2, 3, 4, 5, 6]
        if (weekStart > 0) {
            const removed = order.splice(weekStart - 1, 1)
            order = [...order, ...removed]
        }

        let index = 0
        for (const child of el.querySelectorAll(".page-calendar-week-days .ui-grid-column")) {
            if (order[index] === 0 || order[index] === 6) {
                child.classList.add("page-calendar-weekend")
            } else {
                child.classList.remove("page-calendar-weekend")
            }

            child.innerHTML = `${this.#language.get("weekDays", order[index].toString())}`;
            index++
        }
    }
}
