import { html } from "../utils";
import ui from "ui";

/**
 * @typedef {import("ui/src/wc").Store<import("../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").Secondary} Secondary
 * @typedef {import("ui/src/wc/dialog").DialogEvents} DialogEvents
 */

const flexGridContent = html`
    <ui-flex-grid-item>
        <ui-secondary class="input-label"></ui-secondary>
        <input type="month">
    </ui-flex-grid-item>
`;

/** @extends {ui.wc.Dialog<DialogEvents>} */
export class DatePickerDialog extends ui.wc.Dialog {
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
        this.#store.ui.set("date-picker", this.monthInput.value);
        this.ui.close();
    };

    static register = () => customElements.define("date-picker-dialog", DatePickerDialog);

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();

        this.#store = store;
        this.#lang = lang;

        this.cleanup = [];

        /** @type {HTMLInputElement} */
        this.monthInput = this.querySelector("input");

        this.createContent();
        this.createActions();
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
        content.innerHTML = flexGridContent;

        this.appendChild(content);
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
        this.ui.title = this.#lang.ui.get("date-picker-dialog", "title");
        this.querySelector("ui-secondary").innerHTML =
            this.#lang.ui.get("date-picker-dialog", "input-title-month");

        this.#cancelButton.innerText = this.#lang.ui.get("date-picker-dialog", "button-cancel");
        this.#submitButton.innerText = this.#lang.ui.get("date-picker-dialog", "button-submit");
    } // }}}
}
