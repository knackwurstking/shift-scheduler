import { html } from "ui/src/js/utils";

/**
 * @typedef {import("ui/src/wc").Store} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("../../../types").WeekStartStore} WeekStartStore
 */

const innerHTML = html`
    <ui-label id="miscWeekStart" ripple>
        <input slot="input" id="miscWeekStartInput" type="checkbox">
    </ui-label>
`;

export class WeekStart extends HTMLElement {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    static register = () => customElements.define("week-start", WeekStart)

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

        /** @type {Label} */
        this.label = this.querySelector("ui-label");
        this.input = this.querySelector("input");

        this.querySelector("input").onclick =
            (/**@type{MouseEvent & { currentTarget: HTMLInputElement }}*/ev) =>
                this.#store.ui.set("week-start", ev.currentTarget.checked ? 1 : 0);
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
                this.#store.ui.on("week-start", this.onWeekStart.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
    } // }}}

    /**
     * @private
     * @param {WeekStartStore} weekStart
     */
    onWeekStart(weekStart) { // {{{
        this.input.checked = weekStart === 1;
    } // }}}

    /** @private */
    onLang() { // {{{
        this.label.ui.primary = this.#lang.ui.get(
            "settings", "miscWeekStartPrimary",
        );
    } // }}}
}
