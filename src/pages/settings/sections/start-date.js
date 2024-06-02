/**
 * @typedef {import("ui/src/wc").Store} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc").Input<import("ui/src/wc/input").InputEvents, "date">} DateInput
 * @typedef {import("../../../types").SettingsStore} SettingsStore
 */

import { CleanUp } from "ui/src/js";

const innerHTML = `
<ui-label>
    <ui-input
        slot="input"
        type="date"
    ></ui-input>
</ui-label>
`;

export class StartDate extends HTMLElement {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {DateInput} */
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

        this.cleanup = new CleanUp();

        this.#store = store;
        this.#lang = lang;

        this.#label = this.querySelector("ui-label");
        this.createInput()
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );

            this.cleanup.add(
                this.#store.ui.on("settings", this.onSettings.bind(this), true),
            );
        });
    } // }}}

    diconnectedCallback() { // {{{
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
