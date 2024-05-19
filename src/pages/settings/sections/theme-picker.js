import { html } from "ui/src/js/utils";

/**
 * @typedef {import("../../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc").Select} Select
 * @typedef {import("ui/src/wc").SelectOption} SelectOption
 *
 * @typedef {import("../../../types").ThemeStore} ThemeStore 
 */

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
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    static register = () => customElements.define("theme-picker", ThemePicker);

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        this.#store = store;
        this.#lang = lang;

        this.cleanup = [];

        /** @type {Select} */
        this.selectModeElement = this.querySelector("ui-select");
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
                this.#store.ui.on("theme", this.onTheme.bind(this), true),

                this.selectModeElement.ui.events.on("change", (option) => {
                    console.debug(`[settings] update theme mode:`, option);
                    this.#store.ui.update("theme", (theme) => ({ ...theme, mode: option.ui.value }));
                }),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
    } // }}}

    /**
     * @private
     * @param {ThemeStore} theme
     */
    async onTheme(theme) { // {{{
        console.debug(`[settings] onTheme`, theme);

        /** @type {Select} */
        [...this.selectModeElement.children].forEach(
            (/** @type {SelectOption} */ c) => {
                c.ui.selected = (c.ui.value === theme.mode)
            }
        );
    } // }}}

    /** @private */
    onLang() { // {{{
        this.querySelector("ui-secondary").innerHTML = this.#lang.ui.get("settings", "miscTheme");
    } // }}}
}
