import {
  UIFlexGridItem,
  UIFlexGridRow,
  UISecondary,
  UISelect,
  UISelectOption,
} from "ui";
import { CleanUp, html } from "ui/src/js";

/**
 * @typedef {import("../../../types/.index").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../../types/.index").ThemeStore} ThemeStore
 */

const innerHTML = html`
  <ui-secondary style="display: block;"></ui-secondary>

  <ui-flex-grid-row gap="0.25rem">
    <ui-flex-grid-item style="width: 50%;">
      <ui-select>
        <ui-select-option value="system"> System </ui-select-option>

        <ui-select-option value="dark"> Dark </ui-select-option>

        <ui-select-option value="light"> Light </ui-select-option>
      </ui-select>
    </ui-flex-grid-item>
  </ui-flex-grid-row>
`;

export class ThemePicker extends HTMLElement {
  static register = () => {
    UISecondary.register();
    UIFlexGridRow.register();
    UIFlexGridItem.register();
    UISelect.register();
    UISelectOption.register();

    customElements.define("settings-theme-picker", ThemePicker);
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

    /** @type {UISelect} */
    this.selectModeElement = this.querySelector("ui-select");
  } // }}}

  connectedCallback() {
    // {{{
    this.cleanup.add(this.uiStore.ui.on("lang", this.onLang.bind(this), true));

    this.cleanup.add(
      this.uiStore.ui.on("theme", this.onTheme.bind(this), true),
    );

    this.cleanup.add(
      this.selectModeElement.ui.events.on("change", (option) => {
        this.uiStore.ui.update("theme", (theme) => {
          return { ...theme, mode: option.ui.value };
        });
      }),
    );
  } // }}}

  disconnectedCallback() {
    // {{{
    this.cleanup.run();
  } // }}}

  /**
   * @private
   * @param {ThemeStore} theme
   */
  async onTheme(theme) {
    // {{{
    /** @type {UISelect} */
    [...this.selectModeElement.children].forEach(
      (/** @type {UISelectOption} */ c) => {
        c.ui.selected = c.ui.value === theme.mode;
      },
    );
  } // }}}

  /** @private */
  onLang() {
    // {{{
    this.querySelector("ui-secondary").innerHTML = this.uiLang.ui.get(
      "settings",
      "select-title-theme",
    );
  } // }}}
}
