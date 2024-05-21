import ui from "ui";
import db from "../db";
import * as utils from "../pages/calendar/utils";

/**
 * @typedef {import("ui/src/wc").Store<import("../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Select} Select
 * @typedef {import("ui/src/wc").SelectOption} SelectOption
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").FlexGrid} FlexGrid
 * @typedef {import("ui/src/wc/dialog/dialog").DialogEvents} DialogEvents 
 * @typedef {import("../types").DBDataEntry} DBDataEntry
 * @typedef {import("../types").Shift} Shift
 */

/** @extends {ui.wc.Dialog<DialogEvents & { submit: DBDataEntry }>} */
export class EditDayDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {Select} */
    #shiftSelect;
    /** @type {HTMLTextAreaElement} */
    #notes;

    /** @type {Button} */
    #cancelButton;
    /** @type {() => void|Promise<void>} */
    #onCancel = () => this.ui.close();

    /** @type {Button} */
    #submitButton;
    /** @type {(() => void|Promise<void>)} */
    #onSubmit = async () => {
        if (this.data.shift === this.rhythmShift) {
            this.data.shift = null;
        }

        if (!this.data.note && !this.data.shift) {
            try {
                db.delete(this.data.year, this.data.month, this.data.date);
            } catch (err) {
                alert(err);
            }
        } else {
            try {
                await db.add(this.data);
            } catch {
                try {
                    await db.put(this.data);
                } catch (err) {
                    alert(err);
                }
            }
        }

        this.ui.events.dispatch("submit", { ...this.data, shift: this.data.shift || this.rhythmShift });
        this.ui.close();
    };

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
        /** @type {Shift} */
        this.rhythmShift;

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
        this.ui.title = `${year}/${(month + 1).toString().padStart(2, "0")}/${(date).toString().padStart(2, "0")}`;

        this.data = await db.get(year, month, date);
        this.rhythmShift = utils.calcShiftForDay(new Date(year, month, date), this.#store.ui.get("settings"));

        if (this.data === null) {
            this.data = {
                year, month, date,
                shift: null,
                note: "",
            };
        }

        this.selectShift(this.data.shift || this.rhythmShift);
        this.updateNotes(this.data.note || "");
    } // }}}

    /**
     * @param {Shift | null} shift
     */
    selectShift(shift) { // {{{
        /** @type {SelectOption[]} */
        // @ts-ignore
        const children = [...this.#shiftSelect.children];
        children.forEach(child => {
            child.ui.selected = (shift?.id.toString() === child.ui.value)
                || (!shift && child.ui.value === "0");
        });
    } // }}}

    /**
     * @param {string} note
     */
    updateNotes(note) { // {{{
        this.#notes.value = note;
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new ui.wc.FlexGrid();

        content.setAttribute("gap", "0.5rem");

        this.createShiftsPicker(content);
        this.createNotes(content);

        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container
     */
    createShiftsPicker(container) { // {{{
        const item = new ui.wc.FlexGridItem();

        this.#shiftSelect = new ui.wc.Select();
        this.#shiftSelect.ui.events.on("change", (selectOption) => {
            this.data.shift = this.#store.ui.get("settings").shifts
                .find(shift => shift.id.toString() === selectOption.ui.value) || null;
        });

        const shifts = this.#store.ui.get("settings").shifts;

        let option = new ui.wc.SelectOption();
        option.ui.value = "0"
        option.innerHTML = "&nbsp;"
        this.#shiftSelect.appendChild(option);

        shifts.forEach((shift) => {
            option = new ui.wc.SelectOption();
            option.ui.value = shift.id.toString();
            option.innerText = shift.name;
            this.#shiftSelect.appendChild(option);
        });

        item.appendChild(this.#shiftSelect);
        container.appendChild(item);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container
     */
    createNotes(container) { // {{{
        this.notesItem = new ui.wc.FlexGridItem();
        this.notesItem.innerHTML = `
            <ui-secondary></ui-secondary>
            <textarea rows="6"></textarea>
        `;

        this.#notes = this.notesItem.querySelector("textarea")
        this.#notes.oninput = () => {
            this.data.note = this.#notes.value;
        };

        container.appendChild(this.notesItem);
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
        this.notesItem.querySelector("ui-secondary").innerHTML =
            this.#lang.ui.get("edit-day-dialog", "textarea-title-notes");

        this.#cancelButton.innerText = this.#lang.ui.get("edit-day-dialog", "button-cancel");
        this.#submitButton.innerText = this.#lang.ui.get("edit-day-dialog", "button-submit");
    } // }}}
}
