import { CleanUp } from "ui/src/js";
import { html } from "ui/src/js/utils";
import { EditRhythmDialog } from "../../../dialogs";

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc").Button} Button
 */

const innerHTML = html`
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

    static register = () => customElements.define("settings-edit-rhythm", EditRhythm)

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
        this.createButton()
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
    } // }}}

    /** @private */
    createButton() { // {{{
        this.#button = this.querySelector("ui-button");
        this.#button.onclick = async () => {
            const dialog = new EditRhythmDialog(this.#store, this.#lang)
            document.body.appendChild(dialog);

            dialog.ui.open(true);

            dialog.ui.events.on("close", async () => {
                document.body.removeChild(dialog)
            })
        };
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.#label.ui.primary = this.#lang.ui.get("settings", "label-primary-edit-rhythm");
        this.#button.innerHTML = this.#lang.ui.get("settings", "button-edit-rhythm")
    } // }}}
}
