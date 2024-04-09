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
    <div class="ui-grid-column"></div>
    <div class="ui-grid-column"></div>
    <div class="ui-grid-column"></div>
    <div class="ui-grid-column"></div>
    <div class="ui-grid-column"></div>
    <div class="ui-grid-column"></div>
    <div class="ui-grid-column"></div>
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
        this.#storage.dispatch("first-week-day")
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
        this.#storage.addListener("first-week-day", (data) => {
            console.log('storage: "first-week-day":', data)

            if (data !== 0 || data !== 6) {
                data = 0
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
        const order = [weekStart, 1, 2, 3, 4, 5, (weekStart === 0 ? 6 : 0)]
        let index = 0
        for (const child of el.querySelectorAll(".ui-grid-column")) {
            child.innerHTML = `${order[index]}`; // TODO: use language to get the current date
            index++
        }
    }
}
