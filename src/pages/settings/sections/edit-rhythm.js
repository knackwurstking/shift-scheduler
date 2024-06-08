import { UIButton, UILabel } from "ui";
import { CleanUp } from "ui/src/js";
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

    static register = () => {
        UILabel.register();
        UIButton.register();

        EditRhythmDialog.register();

        customElements.define("settings-edit-rhythm", EditRhythm)
    };

    /**
     * @param {import("ui").UIStore<UIStoreEvents>} store
     * @param {import("ui").UILang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        /** @type {import("ui").UIStore<UIStoreEvents>} */
        this.uiStore = store;
        /** @type {import("ui").UILang} */
        this.uiLang = lang;

        this.cleanup = new CleanUp();

        /** @type {UILabel} */
        this.label = this.querySelector("ui-label");

        /** @type {UIButton} */
        this.button = this.querySelector("ui-button");
        this.createButton()
    } // }}}

    connectedCallback() { // {{{
        this.cleanup.add(
            this.uiStore.ui.on("lang", this.onLang.bind(this), true),
        );
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
    } // }}}

    /** @private */
    createButton() { // {{{
        this.button.onclick = async () => {
            const dialog = new EditRhythmDialog(this.uiStore, this.uiLang)
            document.body.appendChild(dialog);

            dialog.ui.open(true);

            dialog.ui.events.on("close", async () => {
                document.body.removeChild(dialog)
            });
        };
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.label.ui.primary = this.uiLang.ui.get("settings", "label-primary-edit-rhythm");
        this.button.innerHTML = this.uiLang.ui.get("settings", "button-edit-rhythm");
    } // }}}
}
