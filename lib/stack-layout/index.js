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

  goBack() {
    const page = this.pages.pop();
    if (!page) return this;
    page.onDestroy();

    if (!!this.pages.length) {
      const page = this.pages[this.pages.length - 1];
      page.onMount();
      this.#app.appBar.setGroup(page.getName()).setTitle(page.getTitle());
    }

    this.#container.removeChild(page.getElement());

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
    page.onMount();
    this.#app.appBar.setGroup(page.getName()).setTitle(page.getTitle());

    return this;
  }
}
