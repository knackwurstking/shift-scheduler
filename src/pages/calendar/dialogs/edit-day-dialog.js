import ui from "ui";
import { html } from "ui/src/js/utils";

// {{{ Flex Grid Content
const flexGridContent = html`
`;
// }}}

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").FlexGrid} FlexGrid
 * @typedef {import("ui/src/wc/dialog/dialog").DialogEvents} DialogEvents 
 */

/** @extends {ui.wc.Dialog<DialogEvents>} */
export class EditDayDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {Button} */
    #cancelButton;
    /** @type {() => void|Promise<void>} */
    #onCancel = () => this.ui.close();

    /** @type {Button} */
    #submitButton;
    /** @type {() => void|Promise<void>} */
    #onSubmit = () => {
        // TODO: Save note and shift, close the dialog
    };

    /** @type {FlexGrid} */
    #content;

    static register = () => customElements.define("edit-day-dialog", EditDayDialog);

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super()

        this.#store = store;
        this.#lang = lang;

        this.cleanup = [];

        this.createContent();
        this.createActions();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        super.disconnectedCallback();
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @param {number} date
     */
    set(year, month, date) { // {{{
        // TODO: ...
    } // }}}

    /** @private */
    createContent() { // {{{
        this.#content = new ui.wc.FlexGrid();
        this.#content.style.width = "100%";
        this.#content.style.height = "100%";
        this.#content.innerHTML = flexGridContent;
        this.appendChild(this.#content)
    } // }}}

    /** @private */
    createActions() { // {{{
        // Cancel
        let item = new ui.wc.FlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="secondary"></ui-button>
        `;
        this.#cancelButton = item.querySelector("ui-button");
        this.#cancelButton.onclick = this.#onCancel;
        this.appendChild(item)

        // Submit
        item = new ui.wc.FlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="primary"></ui-button>
        `;
        this.#submitButton = item.querySelector("ui-button");
        this.#submitButton.onclick = this.#onSubmit;
        this.appendChild(item)
    } // }}}

    /** @private */
    onLang() { // {{{
        // TODO: "title", ...
        //this.ui.title = ...

        this.#cancelButton.innerText = this.#lang.ui.get("general", "cancelButton");
        this.#submitButton.innerText = this.#lang.ui.get("general", "submitButton");
    } // }}}
}
