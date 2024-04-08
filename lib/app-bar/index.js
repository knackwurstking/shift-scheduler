
export default class AppBar {
    /**
     * @param {HTMLElement}
     */
    constructor(container) {
        this.container = container


        this._left = this.container.querySelector(".ui-app-bar-main > *:first-child")

        this._center = this.container.querySelector(".ui-app-bar-main > *:nth-child(2)")
        this._title = this._center.querySelector(".app-bar-title")

        this._right = this.container.querySelector(".ui-app-bar-main > *:last-child")
    }

    /**
     * @param {string} title
     */
    setTitle(title) {
        this._title.innerText = title
    }
}
