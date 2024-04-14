/**
 * @typedef {import("../../pages/page").default} Page
 */

export default class StackLayout {
  /** @type {HTMLElement} */
  #container;
  /** @type {import("../../app.js").default} */
  #app;

  /**
   * @param {HTMLElement} container
   * @param {import("../../app.js").default} app
   */
  constructor(container, app) {
    this.#container = container;
    this.#app = app;

    /** @type {Page[]} */
    this.pages = [];
  }

  back() {
    const page = this.pages.pop();
    if (!page) return this;
    page.onDestroy();

    const el = page.getElement();
    if (!!el) {
      this.#container.removeChild(el);
    }

    return this;
  }

  /**
   * @param {Page} page
   */
  setPage(page) {
    const el = page.getElement();

    this.#container.appendChild(el);

    if (!!this.pages.length) {
      this.pages[this.pages.length - 1].onDestroy();
    }

    this.pages.push(page);
    this.#app.appBar.setGroup(page.getName());
    this.#app.appBar.setTitle(page.getTitle());

    page.onMount();

    return this;
  }
}
