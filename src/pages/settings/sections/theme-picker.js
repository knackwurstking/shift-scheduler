import ui from "ui";

/**
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../../types").ThemeStore} ThemeStore 
 */

const html = ui.js.html;
const innerHTML = html`
    <ui-secondary style="display: block;"></ui-secondary>

    <ui-flex-grid-row gap="0.25rem">
        <ui-flex-grid-item style="width: 50%;">
            <ui-select>
                <ui-select-option value="system">
                    System
                </ui-select-option>

                <ui-select-option value="dark">
                    Dark
                </ui-select-option>

                <ui-select-option value="light">
                    Light
                </ui-select-option>
            </ui-select>
        </ui-flex-grid-item>
    </ui-flex-grid-row>
`;

export class ThemePicker extends HTMLElement {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    static register = () => customElements.define("settings-theme-picker", ThemePicker);

    /**
     * @param {ui.UIStore<UIStoreEvents>} store
     * @param {ui.UILang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        this.#store = store;
        this.#lang = lang;

        this.cleanup = new ui.js.CleanUp();

        /** @type {ui.UISelect} */
        this.selectModeElement = this.querySelector("ui-select");
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );

            this.cleanup.add(
                this.#store.ui.on("theme", this.onTheme.bind(this), true),
            );

            this.cleanup.add(
                this.selectModeElement.ui.events.on("change", (option) => {
                    console.debug(`[settings] update theme mode:`, option);
                    this.#store.ui.update("theme", (theme) => ({ ...theme, mode: option.ui.value }));
                }),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
    } // }}}

    /**
     * @private
     * @param {ThemeStore} theme
     */
    async onTheme(theme) { // {{{
        console.debug(`[settings] onTheme`, theme);

        /** @type {ui.UISelect} */
        [...this.selectModeElement.children].forEach(
            (/** @type {ui.UISelectOption} */ c) => {
                c.ui.selected = (c.ui.value === theme.mode)
            }
        );
    } // }}}

    /** @private */
    onLang() { // {{{
        this.querySelector("ui-secondary").innerHTML = this.#lang.ui.get("settings", "select-title-theme");
    } // }}}
}
