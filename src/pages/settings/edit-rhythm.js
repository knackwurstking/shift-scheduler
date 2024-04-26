/**
 * @typedef {import("ui/src/wc").Store} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Primary} Primary
 * @typedef {import("ui/src/wc").Button} Button
 */

const innerHTML = `
<ui-label>
    <ui-primary slot="primary"></ui-primary>

    <ui-button color="primary" variant="full"></ui-button>
</ui-label>
`;

export class EditRhythm extends HTMLElement {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;
    /** @type {Primary} */
    #primary;
    /** @type {Button} */
    #button

    static register = () => customElements.define("settings-edit-rhythm", EditRhythm)

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

        this.#primary = this.querySelector("ui-primary");
        this.#button = this.querySelector("ui-button")

        this.#button.onclick = () => {
            // TODO: open a (fullscreen) dialog page (add callback function for handling data on submit)
        }
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.push(
                this.#store.data.on("lang", async () => {
                    this.#primary.innerHTML = this.#lang.data.get("settings", "shiftsEditRhythmPrimary");
                    this.#button.innerHTML = this.#lang.data.get("settings", "shiftsEditRhythmButton")
                }, true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.forEach((fn) => fn());
        this.cleanup = [];
    } // }}}
}
