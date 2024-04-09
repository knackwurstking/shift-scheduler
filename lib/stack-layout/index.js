export default class StackLayout {
  /**
   * @param {HTMLElement} container
   * @param {import("../app-bar").default} appBar
   */
  constructor(container, appBar) {
    // TODO: on page change enable/disable the app bar backbutton and more
    this.container = container;
    this.appBar = appBar; // NOTE: for back button control

    this.pageClassName = "stack-layout-page";
  }

  back() {
    const children = [...this.container.children].reverse();

    const el = children.find((c) => c.classList.contains(this.pageClassName));
    if (!!el) rootContainer.removeChild(el);

    return this;
  }

  /**
   * @param {HTMLElement}
   */
  setPage(page) {
    page.classList.add(this.pageClassName);
    this.container.appendChild(page);

    return this;
  }
}
