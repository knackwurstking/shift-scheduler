import ui from "ui";

export class EditShiftDialog extends ui.wc.Dialog {

    /**
     * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
     * @typedef {import("ui/src/wc").Lang} Lang
     */

    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () => customElements.define("edit-shift-dialog", EditShiftDialog)

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.createActionButtons();
        this.createContent();

        this.#store = store;
        this.#lang = lang

        this.cleanup = []

        /** @private */
        this.onLang = async () => { // {{{
            this.ui.title = this.#lang.ui.get("settings", "dialogEditShiftTitle");

            this.querySelector("ui-flex-grid-item:nth-child(1) ui-secondary").innerHTML =
                this.#lang.ui.get("settings", "dialogEditShiftName");

            this.querySelector("ui-flex-grid-item:nth-child(2) ui-secondary").innerHTML =
                this.#lang.ui.get("settings", "dialogEditShiftShortName");
        } // }}}
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        setTimeout(() => {
            this.#store.ui.on("lang", this.onLang, true);
        });
    } // }}}

    disconnectedCallback() { // {{{
        super.disconnectedCallback();
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new ui.wc.FlexGrid();
        content.setAttribute("gap", "0.5rem");
        {
            // Name
            let item = new ui.wc.FlexGridItem();
            item.innerHTML = `
                <ui-secondary></ui-secondary>
                <input type="text">
            `;
            // TODO: Adding the input on change handler
            content.appendChild(item);

            // Short Name
            item = new ui.wc.FlexGridItem();
            item.innerHTML = `
                <ui-secondary></ui-secondary>
                <input type="text">
            `;
            // TODO: Adding the input on change handler
            content.appendChild(item);
        }

        this.appendChild(content);
    } // }}}

    /** @private */
    createActionButtons() { // {{{ TODO: "cancel", "submit"
    } // }}}
}
