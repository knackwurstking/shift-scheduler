import * as ui from "ui";

/**
 * @typedef {import("ui/src/ui-input").UIInputEvents} UIInputEvents
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../../types").SettingsStore} SettingsStore
 */

const innerHTML = `
<ui-label>
    <ui-input
        slot="input"
        type="date"
    ></ui-input>
</ui-label>
`;

export class StartDate extends HTMLElement {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    /** @type {ui.UIInput<UIInputEvents, "date">} */
    #input;
    /** @type {ui.UILabel} */
    #label;

    static register = () => customElements.define("settings-start-date", StartDate)

    /**
     * @param {ui.UIStore<UIStoreEvents>} store
     * @param {ui.UILang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        this.cleanup = new ui.js.CleanUp();

        this.#store = store;
        this.#lang = lang;

        this.#label = this.querySelector("ui-label");
        this.createInput()
    } // }}}

    connectedCallback() { // {{{
        this.cleanup.add(
            this.#store.ui.on("lang", this.onLang.bind(this), true),
        );

        this.cleanup.add(
            this.#store.ui.on("settings", this.onSettings.bind(this), true),
        );
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
    } // }}}

    /** @private */
    createInput() { // {{{
        this.#input = this.querySelector("ui-input");

        this.#input.ui.events.on("input", (/** @type {string} */value) => {
            this.#store.ui.update(
                "settings", (/**@type{SettingsStore}*/ settings) => {
                    settings.startDate = value;
                    return settings;
                },
            );
        });
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.#label.ui.primary = this.#lang.ui.get(
            "settings", "label-primary-start-date"
        );
    } // }}}

    /**
     * @private
     * @param {SettingsStore} settings
     */
    async onSettings(settings) { // {{{
        if (settings.startDate === this.#input.ui.value) return;
        this.#input.ui.value = settings.startDate;
    } // }}}
}
