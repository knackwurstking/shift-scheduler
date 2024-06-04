import * as ui from "ui";
import { EditRhythmDialog } from "../../../dialogs";

/**
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
 */

const innerHTML = `
<ui-label>
    <ui-button color="primary" variant="full"></ui-button>
</ui-label>
`;

export class EditRhythm extends HTMLElement {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    /** @type {ui.UILabel} */
    #label;
    /** @type {ui.UIButton} */
    #button

    static register = () => customElements.define("settings-edit-rhythm", EditRhythm)

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
