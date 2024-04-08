
export default class AppBar {
    #left
    #center
    #right

    #backButton

    #datePicker
    #createDatePicker

    #title

    /**
     * @param {HTMLElement} container
     * @param {import("../date-picker").default} datePicker
     */
    constructor(container, datePicker) {
        this.container = container
        this.datePicker = datePicker

        this.#left = this.container.querySelector(".ui-app-bar-main > *:first-child")
        this.#center = this.container.querySelector(".ui-app-bar-main > *:nth-child(2)")
        this.#right = this.container.querySelector(".ui-app-bar-main > *:last-child")

        this.#backButton = this.#left.querySelector(".app-bar-back-button")

        this.#datePicker = this.#left.querySelector(".app-bar-date-picker")
        this.#datePicker.innerText = `${this.datePicker.toMonthString()}`

        this.#title = this.#center.querySelector(".app-bar-title")
    }

    /**
     * @param {string} title
     */
    setTitle(title) {
        this.#title.innerText = title
    }
}
