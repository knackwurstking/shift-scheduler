import ui from "ui";

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").FlexGrid} FlexGrid
 * @typedef {import("ui/src/wc").Button} Button
 *
 * @typedef {import("../../../types").Shift} Shift
 */

export class EditShiftDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () => customElements.define("edit-shift-dialog", EditShiftDialog)

    /**
     * @param {Shift} shift
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(shift, store, lang) { // {{{
        super();

        this.#store = store;
        this.#lang = lang
        /** @type {Shift} */
        this.shift = shift

        /** @type {Button} */
        this.cancelButton;
        /** @type {Button} */
        this.submitButton;

        this.createContent();
        this.createActionButtons();

        this.cleanup = []
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        setTimeout(() => {
            this.#store.ui.on("lang", this.onLang.bind(this), true);
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
        this.createContentSectionName(content)
        this.createContentSectionShortName(content)
        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container 
     */
    createContentSectionName(container) { // {{{
        // Name
        let item = new ui.wc.FlexGridItem();
        // TODO: Add initial value from this.shift
        item.innerHTML = `
                <ui-secondary></ui-secondary>
                <input type="text">
            `;
        // TODO: Adding the input on change handler
        container.appendChild(item);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container 
     */
    createContentSectionShortName(container) { // {{{
        const item = new ui.wc.FlexGridItem();
        // TODO: Add initial value from `this.shift`
        item.innerHTML = `
                <ui-secondary></ui-secondary>
                <input type="text">
            `;
        // TODO: Adding the input on change handler
        container.appendChild(item);
    } // }}}

    /** @private */
    createActionButtons() { // {{{
        let item = new ui.wc.FlexGridItem()
        item.slot = "actions"
        this.cancelButton = new ui.wc.Button()
        this.cancelButton.setAttribute("color", "secondary")
        this.cancelButton.setAttribute("variant", "full")
        this.cancelButton.innerText = "Cancel"
        item.appendChild(this.cancelButton)
        this.appendChild(item)

        item = new ui.wc.FlexGridItem()
        item.slot = "actions"
        this.submitButton = new ui.wc.Button()
        this.submitButton.setAttribute("color", "primary")
        this.submitButton.setAttribute("variant", "full")
        this.submitButton.innerText = "Submit"
        item.appendChild(this.submitButton)
        this.appendChild(item)
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.ui.title = this.#lang.ui.get("settings", "dialogEditShiftTitle");

        // Name
        this.querySelector("ui-flex-grid-item:nth-child(1) ui-secondary").innerHTML =
            this.#lang.ui.get("settings", "dialogEditShiftName");

        // Short
        this.querySelector("ui-flex-grid-item:nth-child(2) ui-secondary").innerHTML =
            this.#lang.ui.get("settings", "dialogEditShiftShortName");

        this.submitButton.innerText = this.#lang.ui.get("general", "submitButton")
        this.cancelButton.innerText = this.#lang.ui.get("general", "cancelButton")
    }
} // }}}
