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

    /** @type {Page[]} */
    this.pages = []
  }

  back() {
    const page = this.pages.pop()
    if (!page) return this
    page.onDestroy()

    const el = page.getContainer()
    if (!!el) {
      this.#container.removeChild(el);
    }

    return this;
  }

  /**
   * @param {Page} page
   */
  setPage(page) {
    const el = page.getContainer()

    if (!el.classList.contains(this.#pageClassName)) {
      el.classList.add(this.#pageClassName);
    }

    this.#container.appendChild(el);

    if (!!this.pages.length) {
      this.pages[this.pages.length - 1].onDestroy()
    }

    this.pages.push(page)
    this.#appBar.group = page.getName()

    page.onMount()

    return this;
  }
}
