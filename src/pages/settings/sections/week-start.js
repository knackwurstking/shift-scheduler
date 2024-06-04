import ui from "ui";

/**
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../../types").WeekStartStore} WeekStartStore
 */

const innerHTML = `
    <ui-label ripple>
        <input slot="input" type="checkbox">
    </ui-label>
`;

export class WeekStart extends HTMLElement {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    static register = () => customElements.define("settings-week-start", WeekStart)

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

        /** @type {ui.UILabel} */
        this.label = this.querySelector("ui-label");
        this.input = this.querySelector("input");

        this.querySelector("input").onclick =
            (/**@type{MouseEvent & { currentTarget: HTMLInputElement }}*/ev) =>
                this.#store.ui.set("week-start", ev.currentTarget.checked ? 1 : 0);
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );

            this.cleanup.add(
                this.#store.ui.on("week-start", this.onWeekStart.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
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
            "settings", "label-primary-week-start",
        );
    } // }}}
}
