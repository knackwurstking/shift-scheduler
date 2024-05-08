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
        this.modShift = {
            ...shift
        }

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
                <input type="text" value="${this.modShift.name}">
            `;

        item.querySelector("input").oninput = (/** @type {Event & { currentTarget: HTMLInputElement }} */ev) => {
            this.modShift.name = ev.currentTarget.value;
        };

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
                    style="color: ${this.modShift.color || 'inherit'};"
                    type="text"
                    value="${this.modShift.shortName}"
                >
            `;

        item.querySelector("input").oninput = (/** @type {Event & { currentTarget: HTMLInputElement }} */ev) => {
            this.modShift.shortName = ev.currentTarget.value;
        };

        container.appendChild(item);
    } // }}}

    /** @private */
    createActionButtons() { // {{{
        // Cancel Button
        let item = new ui.wc.FlexGridItem()
        item.slot = "actions"
        item.innerHTML = `<ui-button color="secondary" variant="full"></ui-button>`
        this.cancelButton = item.querySelector("ui-button")
        this.cancelButton.onclick = () => {
            // TODO: Close dialog without saving
        }
        this.appendChild(item)

        // Submit Button
        item = new ui.wc.FlexGridItem()
        item.slot = "actions"
        item.innerHTML = `<ui-button color="primary" variant="full"></ui-button>`
        this.submitButton = item.querySelector("ui-button")
        this.submitButton.onclick = () => {
            // TODO: Save and close dialog
        }
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
