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

        item.innerHTML = `
                <ui-secondary></ui-secondary>
                <input type="text" value="${this.shift.name}">
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

        item.innerHTML = `
                <ui-secondary></ui-secondary>
                <input
                    style="color: ${this.shift.color || 'inherit'};"
                    type="text"
                    value="${this.shift.shortName}"
                >
            `;

        // TODO: Adding the input on change handler

        container.appendChild(item);
    } // }}}

    /** @private */
    createActionButtons() { // {{{
        // Cancel Button
        let item = new ui.wc.FlexGridItem()
        item.slot = "actions"

        this.cancelButton = new ui.wc.Button()
        this.cancelButton.setAttribute("color", "secondary")
        this.cancelButton.setAttribute("variant", "full")
        this.cancelButton.innerText = "Cancel"
        this.cancelButton.onclick = () => {
            // TODO: Close dialog without saving
        }

        item.appendChild(this.cancelButton)
        this.appendChild(item)

        // Submit Button
        item = new ui.wc.FlexGridItem()
        item.slot = "actions"

        this.submitButton = new ui.wc.Button()
        this.submitButton.setAttribute("color", "primary")
        this.submitButton.setAttribute("variant", "full")
        this.submitButton.innerText = "Submit"
        this.submitButton.onclick = () => {
            // TODO: Save and close dialog
        }

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
