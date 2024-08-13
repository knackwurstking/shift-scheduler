import { UILabel } from "ui";
import { CleanUp, html } from "ui/src/js";

/**
 * @typedef {import("../../../types/.index").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../../types/.index").WeekStartStore} WeekStartStore
 */

const innerHTML = html`
  <ui-label ripple>
    <input slot="input" type="checkbox" />
  </ui-label>
`;

export class WeekStart extends HTMLElement {
  static register = () => {
    UILabel.register();

    customElements.define("settings-week-start", WeekStart);
  };

  /**
   * @param {import("ui").UIStore<UIStoreEvents>} store
   * @param {import("ui").UILang} lang
   */
  constructor(store, lang) {
    // {{{
    super();
    this.innerHTML = innerHTML;

    /** @type {import("ui").UIStore<UIStoreEvents>} */
    this.uiStore = store;
    /** @type {import("ui").UILang} */
    this.uiLang = lang;

    this.cleanup = new CleanUp();

    /** @type {UILabel} */
    this.label = this.querySelector("ui-label");
    this.input = this.querySelector("input");

    this.querySelector("input").onclick = (
      /**@type{MouseEvent & { currentTarget: HTMLInputElement }}*/ ev,
    ) => {
      this.uiStore.ui.set("week-start", ev.currentTarget.checked ? 1 : 0);
    };
  } // }}}

  connectedCallback() {
    // {{{
    this.cleanup.add(this.uiStore.ui.on("lang", this.onLang.bind(this), true));

    this.cleanup.add(
      this.uiStore.ui.on("week-start", this.onWeekStart.bind(this), true),
    );
  } // }}}

  disconnectedCallback() {
    // {{{
    this.cleanup.run();
  } // }}}

  /**
   * @private
   * @param {WeekStartStore} weekStart
   */
  onWeekStart(weekStart) {
    // {{{
    this.input.checked = weekStart === 1;
  } // }}}

  /** @private */
  onLang() {
    // {{{
    this.label.ui.primary = this.uiLang.ui.get(
      "settings",
      "label-primary-week-start",
    );
  } // }}}
}
