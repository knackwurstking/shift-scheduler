export const innerHTML = `
<!-- TODO: ... -->
`;

/**
 * @type {import("../page").Page}
 */
export default class CalendarPage {
    #container;

    constructor() {
        this.#container = document.createElement("div");
        this.#container.innerHTML = innerHTML;
    }

    getName() {
        return "calendar";
    }

    getTitle() {
        return "Calendar";
    }

    getContainer() {
        return this.#container
    }
}
