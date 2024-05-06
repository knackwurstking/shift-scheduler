import { EditRhythmDialog } from "../dialogs"

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc").Button} Button
 */

const innerHTML = `
<ui-label>
    <ui-button color="primary" variant="full"></ui-button>
</ui-label>
`;

export class EditRhythm extends HTMLElement {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {Label} */
    #label;
    /** @type {Button} */
    #button
    /** @type {EditRhythmDialog} */
    #dialog

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

        this.#label = this.querySelector("ui-label");
        this.createButton()
        this.createDialog()
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.forEach((fn) => fn());
        this.cleanup = [];
    } // }}}

    /** @private */
    createButton() { // {{{
        this.#button = this.querySelector("ui-button");
        this.#button.onclick = async () => {
            document.body.appendChild(this.#dialog);
            this.#dialog.ui.open(true);
        };
    } // }}}

    /** @private */
    createDialog() { // {{{
        this.#dialog = new EditRhythmDialog(this.#store, this.#lang)
        this.#dialog.ui.events.on("close", async () => {
            document.body.removeChild(this.#dialog)
        })
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.#label.ui.primary = this.#lang.ui.get("settings", "shiftsEditRhythmPrimary");
        this.#button.innerHTML = this.#lang.ui.get("settings", "shiftsEditRhythmButton")
    } // }}}
}
