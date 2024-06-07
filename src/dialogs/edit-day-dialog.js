import {
    UIButton,
    UIDialog,
    UIFlexGrid,
    UIFlexGridItem,
    UISelect,
    UISelectOption
} from "ui";
import db from "../db";
import { calcShiftForDay } from "../pages/calendar/utils";
import { UISecondary } from "ui";

/**
 * @typedef {import("ui/src/ui-dialog").UIDialogEvents} UIDialogEvents
 * @typedef {import("../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../types").DBDataEntry} DBDataEntry
 * @typedef {import("../types").Shift} Shift
 */

/**
 * @extends {UIDialog<UIDialogEvents & { submit: DBDataEntry }>}
 */
export class EditDayDialog extends UIDialog {

    static register = () => {
        UIDialog.register();
        UISelect.register();
        UISelectOption.register();
        UIButton.register();
        UIFlexGrid.register();
        UIFlexGridItem.register();
        UISecondary.register();

        if (!customElements.get("edit-day-dialog")) {
            customElements.define("edit-day-dialog", EditDayDialog);
        }
    };

    /**
     * @param {import("ui").UIStore<UIStoreEvents>} store
     * @param {import("ui").UILang} lang
     */
    constructor(store, lang) { // {{{
        super()

        /**
         * @type {import("ui").UIStore<UIStoreEvents>}
         */
        this.uiStore = store;

        /**
         * @type {import("ui").UILang}
         */
        this.uiLang = lang;

        /**
         * @type {import("ui").UIStackLayout}
         */
        this.stackLayout = document.querySelector("ui-stack-layout")

        /**
         * @type {UISelect}
         */
        this.shiftSelect;

        /**
         * @type {HTMLTextAreaElement}
         */
        this.notes;

        /**
         * @type {DBDataEntry | null}
         */
        this.data = null;

        /**
         * @type {Shift}
         */
        this.rhythmShift;

        /**
         * @type {UIButton}
         */
        this.cancel;

        /**
         * @type {UIButton}
         */
        this.submit;

        this.createContent();
        this.createActions();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        this.stackLayout.ui.lock();
        this.cleanup.add(() => this.stackLayout.ui.unlock());

        setTimeout(() => {
            this.cleanup.add(
                this.uiStore.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @param {number} date
     */
    async set(year, month, date) { // {{{
        const m = (month + 1).toString().padStart(2, "0");
        const d = (date).toString().padStart(2, "0");
        this.ui.title = `${year}/${m}/${d}`;

        this.data = await db.get(year, month, date);
        this.rhythmShift = calcShiftForDay(new Date(year, month, date), this.uiStore.ui.get("settings"));

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
        /** @type {UISelectOption[]} */
        // @ts-ignore
        const children = [...this.shiftSelect.children];
        children.forEach(child => {
            child.ui.selected = (shift?.id.toString() === child.ui.value)
                || (!shift && child.ui.value === "0");
        });
    } // }}}

    /**
     * @param {string} note
     */
    updateNotes(note) { // {{{
        this.notes.value = note;
    } // }}}

    /**
     * @private
     */
    createContent() { // {{{
        const content = new UIFlexGrid();

        content.setAttribute("gap", "0.5rem");

        this.createShiftsPicker(content);
        this.createNotes(content);

        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {UIFlexGrid} container
     */
    createShiftsPicker(container) { // {{{
        const item = new UIFlexGridItem();

        this.shiftSelect = new UISelect();
        this.shiftSelect.ui.events.on("change", (selectOption) => {
            this.data.shift = this.uiStore.ui.get("settings").shifts
                .find(shift => shift.id.toString() === selectOption.ui.value) || null;
        });

        const shifts = this.uiStore.ui.get("settings").shifts;

        let option = new UISelectOption();
        option.ui.value = "0";
        option.innerHTML = this.uiLang.ui.get("edit-day-dialog", "reset");
        this.shiftSelect.appendChild(option);

        shifts.forEach((shift) => {
            option = new UISelectOption();
            option.ui.value = shift.id.toString();
            option.innerText = shift.name;
            this.shiftSelect.appendChild(option);
        });

        item.appendChild(this.shiftSelect);
        container.appendChild(item);
    } // }}}

    /**
     * @private
     * @param {UIFlexGrid} container
     */
    createNotes(container) { // {{{
        this.notesItem = new UIFlexGridItem();
        this.notesItem.innerHTML = `
            <ui-secondary></ui-secondary>
            <textarea rows="6"></textarea>
        `;

        this.notes = this.notesItem.querySelector("textarea")
        this.notes.oninput = () => {
            this.data.note = this.notes.value;
        };

        container.appendChild(this.notesItem);
    } // }}}

    /** @private */
    createActions() { // {{{
        // Cancel
        let item = new UIFlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="secondary"></ui-button>
        `;
        this.cancel = item.querySelector("ui-button");
        this.cancel.onclick = this.onCancel.bind(this);
        this.appendChild(item)

        // Submit
        item = new UIFlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="primary"></ui-button>
        `;
        this.submit = item.querySelector("ui-button");
        this.submit.onclick = this.onSubmit.bind(this);
        this.appendChild(item)
    } // }}}

    onCancel() { // {{{
        this.ui.close();
    } // }}}

    async onSubmit() { // {{{
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
    }; // }}}

    /** @private */
    onLang() { // {{{
        this.notesItem.querySelector("ui-secondary").innerHTML =
            this.uiLang.ui.get("edit-day-dialog", "textarea-title-notes");

        this.cancel.innerText = this.uiLang.ui.get("edit-day-dialog", "button-cancel");
        this.submit.innerText = this.uiLang.ui.get("edit-day-dialog", "button-submit");
    } // }}}
}
