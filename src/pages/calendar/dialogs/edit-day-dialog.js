import ui from "ui";
import { html } from "ui/src/js/utils";
import db from "../../../db";
import * as utils from "../utils";

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
 * @typedef {import("../../../types").DBDataEntry} DBDataEntry
 */

/** @extends {ui.wc.Dialog<DialogEvents>} */
export class EditDayDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {number} */
    #year = 0;
    /** @type {number} */
    #month = 0;
    /** @type {number} */
    #date = 0;

    /** @type {Button} */
    #cancelButton;
    /** @type {() => void|Promise<void>} */
    #onCancel = () => this.ui.close();

    /** @type {Button} */
    #submitButton;
    /** @type {() => void|Promise<void>} */
    #onSubmit = () => {
        // TODO: Save note and shift, close the dialog
        this.ui.close();
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
        /** @type {DBDataEntry | null} */
        this.data = null;

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
    async set(year, month, date) { // {{{
        this.#year = year;
        this.#month = month;
        this.#date = date;

        this.data = await db.get(year, month, date);
        this.rhythmShift = utils.calcShiftForDay(new Date(year, month, date), this.#store.ui.get("settings"));
        if (this.data === null) {
            this.data = {
                year, month, date,
                shift: null,
                note: "",
            };
        }
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
        const weekDay = this.#lang.ui.get("calendar", new Date(this.#year, this.#month, this.#date).getDay().toString());
        this.ui.title = `${this.#year}/${this.#month}/${this.#date} - ${weekDay}`;

        this.#cancelButton.innerText = this.#lang.ui.get("general", "cancelButton");
        this.#submitButton.innerText = this.#lang.ui.get("general", "submitButton");
    } // }}}
}
