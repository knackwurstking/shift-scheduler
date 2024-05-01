/**
 * @typedef {import("ui/src/wc").Store} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("../../types").SettingsStore} SettingsStore
 */

const innerHTML = `
<ui-label>
    <ui-primary slot="primary"></ui-primary>

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
    /** @type {HTMLElement} */
    #primary;

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

        this.#input = this.querySelector("input");
        this.#primary = this.querySelector("ui-primary");

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

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on(
                    "lang",
                    () => {
                        this.#primary.innerHTML = this.#lang.ui.get(
                            "settings",
                            "shiftsStartDatePrimary",
                        );
                    },
                    true,
                ),

                this.#store.ui.on(
                    "settings",
                    (/** @type {SettingsStore} */ settings) => {
                        if (settings.startDate === this.#input.value) return;
                        this.#input.value = settings.startDate;
                    },
                    true,
                ),
            );
        });
    } // }}}

    diconnectedCallback() { // {{{
        this.cleanup.forEach((fn) => fn());
        this.cleanup = [];
    } // }}}
}
