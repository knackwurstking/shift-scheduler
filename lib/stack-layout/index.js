export default class StackLayout {
    /** @type {HTMLElement} */
    #container
    /** @type {import("../app-bar").default} */
    #appBar
    /** @type {string} */
    #pageClassName

    /**
     * @param {HTMLElement} container
     * @param {import("../app-bar").default} appBar
     */
    constructor(container, appBar) {
        this.#container = container;
        this.#appBar = appBar; // NOTE: for back button control
        this.#pageClassName = "stack-layout-page";

        /** @type {import("../../pages/page").Page[]} */
        this.pages = []
    }

    back() {
        const el = this.pages.pop()?.getContainer()
        if (!!el) this.#container.removeChild(el);

        return this;
    }

    /**
     * @param {import("../../pages/page").Page} page
     */
    setPage(page) {
        const el = page.getContainer()

        if (!el.classList.contains(this.#pageClassName)) el.classList.add(this.#pageClassName);
        this.#container.appendChild(el);

        this.pages.push(page)

        return this;
    }
}
