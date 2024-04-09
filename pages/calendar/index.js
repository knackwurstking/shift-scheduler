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
    <div class="ui-grid-column" data-week-index="0"></div>
    <div class="ui-grid-column" data-week-index="1"></div>
    <div class="ui-grid-column" data-week-index="2"></div>
    <div class="ui-grid-column" data-week-index="3"></div>
    <div class="ui-grid-column" data-week-index="4"></div>
    <div class="ui-grid-column" data-week-index="5"></div>
    <div class="ui-grid-column" data-week-index="6"></div>
  </div>
</div>
`;

/**
 * @type {import("../page").Page}
 */
export default class CalendarPage {
  #container;

  constructor() {
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

    for (const el of this.#container.querySelectorAll(".page-calendar-item")) {
      el.innerHTML = itemTemplate;
      this.#createWeekDays(el);
    }
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

  /**
   * @param {Element} el
   */
  #createWeekDays(el) {
    // TODO: get week-days configuration from storage (week-start on monday or sunday, and language de or en)
  }
}
