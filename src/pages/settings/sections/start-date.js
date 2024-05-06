/**
 * @typedef {import("ui/src/wc").Store} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("../../../types").SettingsStore} SettingsStore
 */

const innerHTML = `
<ui-label>
    <input slot="input" style="width: fit-content" type="date" />
</ui-label>
`;

export class StartDate extends HTMLElement {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {HTMLInputElement} */
    #input;
    /** @type {Label} */
    #label;

    static register = () => customElements.define("settings-start-date", StartDate)

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        /** @type {(() => void)[]} */
        this.cleanup = [];

        this.#store = store;
        this.#lang = lang;

        this.#label = this.querySelector("ui-label");
        this.createInput()
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
                this.#store.ui.on("settings", this.onSettings.bind(this), true),
            );
        });
    } // }}}

    diconnectedCallback() { // {{{
        this.cleanup.forEach((fn) => fn());
        this.cleanup = [];
    } // }}}

    /** @private */
    createInput() { // {{{
        this.#input = this.querySelector("input");

        this.#input.oninput = ({ currentTarget }) => {
            this.#store.ui.update(
                "settings",
                (/**@type{SettingsStore}*/ settings) => {
                    // NOTE: value format: "YYYY-MM-DD"
                    // @ts-expect-error
                    settings.startDate = currentTarget.value;
                    return settings;
                },
            );
        };
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.#label.ui.primary = this.#lang.ui.get(
            "settings", "shiftsStartDatePrimary"
        );
    } // }}}

    /**
     * @private
     * @param {SettingsStore} settings
     */
    async onSettings(settings) { // {{{
        if (settings.startDate === this.#input.value) return;
        this.#input.value = settings.startDate;
    } // }}}
}
