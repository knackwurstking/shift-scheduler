/**
 * @typedef Groups
 * @type {"" | "calendar" | "pdf" | "settings"}
 *
 * @typedef OnClickElements
 * @type {"back-button"| "date-picker" | "edit-mode" | "pdf" | "settings"}
 */

export default class AppBar {
    /** @type {Groups} */
    #activeGroup;

    /** @type {HTMLElement | null} */
    #leftContainer;
    /** @type {HTMLElement | null} */
    #centerContainer;
    /** @type {HTMLElement | null} */
    #rightContainer;

    /** @type {HTMLElement | null} */
    #backButton; // icon button
    /** @type {HTMLElement | null} */
    #datePicker; // button (year / month)

    /** @type {HTMLElement | null} */
    #title; // app title

    /** @type {HTMLElement | null} */
    #editMode; // icon button
    /** @type {HTMLElement | null} */
    #today; // icon button
    /** @type {HTMLElement | null} */
    #pdf; // icon button
    /** @type {HTMLElement | null} */
    #settings; // icon button

    /** @type {{[key: string]: (HTMLElement | null)}} */
    #onClickHandlers;

    /**
     * @param {HTMLElement} container
     * @param {import("../date-picker").default} datePicker
     * @param {Groups} activeGroup
     */
    constructor(container, datePicker, activeGroup) {
        this.container = container;
        this.datePicker = datePicker;

        this.#leftContainer = this.container.querySelector(
            ".ui-app-bar-main > *:first-child",
        );
        this.#centerContainer = this.container.querySelector(
            ".ui-app-bar-main > *:nth-child(2)",
        );
        this.#rightContainer = this.container.querySelector(
            ".ui-app-bar-main > *:last-child",
        );

        this.#backButton = this.#leftContainer.querySelector(
            ".app-bar-back-button",
        );

        this.#datePicker = this.#leftContainer.querySelector(
            ".app-bar-date-picker",
        );
        this.#datePicker.innerText = `${this.datePicker.toMonthString()}`;

        this.#title = this.#centerContainer.querySelector(".app-bar-title");

        this.#editMode = this.#rightContainer.querySelector(".app-bar-edit-mode");
        this.#today = this.#rightContainer.querySelector(".app-bar-today");
        this.#pdf = this.#rightContainer.querySelector(".app-bar-pdf");
        this.#settings = this.#rightContainer.querySelector(".app-bar-settings");

        this.#onClickHandlers = {
            "back-button": this.#backButton,
            "date-picker": this.#datePicker,
            "edit-mode": this.#editMode,
            pdf: this.#pdf,
            settings: this.#settings,
        };

        this.groups = {
            "": [],
            calendar: [
                this.#datePicker,
                this.#editMode,
                this.#today,
                this.#pdf,
                this.#settings,
            ],
            pdf: [this.#backButton, this.#title],
            settings: [this.#backButton, this.#title],
        };
        this.setActiveGroup(activeGroup);
    }

    getActiveGroup() {
        return this.#activeGroup;
    }

    /**
     * @param {Groups} group
     */
    setActiveGroup(group) {
        const newGroup = this.groups[group] || [];
        for (const g1 of [...Object.values(this.groups)]) {
            for (const g2 of g1) {
                if (newGroup.findIndex((g) => g == g2) > -1) g2.style.display = "block";
                else g2.style.display = "none";
            }
        }

        this.#activeGroup = group;
    }

    /**
     * @param {string} title
     */
    setTitle(title) {
        this.#title.innerText = title;
    }

    /**
     * @param {OnClickElements} el
     * @param {((el: MouseEvent & { currentTarget: HTMLElement }) => void|Promise<void>)| null} handler
     */
    onClick(el, handler) {
        this.#onClickHandlers[el].onclick = handler;
    }

    /**
     * @param {OnClickElements} el
     */
    getClickHandler(el) {
        return this.#onClickHandlers[el].onclick;
    }

    /**
     * @param {OnClickElements} el
     */
    click(el) {
        this.#onClickHandlers[el].click();
    }
}
