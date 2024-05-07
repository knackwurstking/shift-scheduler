import ui from "ui";
import { html } from "../../../utils";
import * as dialogs from "../dialogs";

/**
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 *
 * @typedef {import("../../../types").SettingsStore} SettingsStore
 * @typedef {import("../../../types").Shift} Shift
 */

const innerHTML = html`
<thead>
    <tr>
        <th style="text-align: left;"></th>
        <th style="text-align: left;"></th>
        <th style="text-align: right;"></th>
    </tr>
</thead>

<tbody></tbody>
`

export class ShiftsTable extends HTMLTableElement {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () => customElements.define("settings-shifts-table", ShiftsTable, { extends: "table" })

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.#store = store
        this.#lang = lang
        this.innerHTML = innerHTML;
        this.cleanup = [];
        this.tbody = this.querySelector("tbody");
    } // }}}

    connectedCallback() { // {{{
        this.cleanup.push(
            this.#store.ui.on("lang", this.onLang.bind(this), true),
            this.#store.ui.on("settings", this.onSettings.bind(this), true),
        );
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
    } // }}}

    /**
     * @private
     * @param {SettingsStore} settings
     */
    renderShiftsTable(settings) { // {{{
        while (!!this.tbody.firstChild) this.tbody.removeChild(this.tbody.firstChild)

        let dStart = null
        settings.shifts.forEach((shift, index) => {
            const tr = document.createElement("tr")
            tr.appendChild(this.createTableName(shift))
            tr.appendChild(this.createTableShortName(shift))
            tr.appendChild(this.createTableActions(shift))
            this.tbody.appendChild(tr);

            // Draggable Setup
            ui.js.draggable.create(tr, {
                onDragStart: async () => { // {{{
                    dStart = index;
                }, // }}}

                onDragging: async () => { // {{{
                    if (dStart === null) return;

                    [...this.tbody.children].forEach((/**@type{HTMLElement}*/c, ci) => {
                        if (index !== ci) {
                            c.style.background = "inherit";
                            c.style.color = "inherit";
                            return
                        }

                        c.style.background = "var(--ui-primary-bgColor)";
                        c.style.color = "var(--ui-primary-color)";
                    });
                }, // }}}

                onDragEnd: async () => { // {{{
                    if (dStart === null) return;

                    if (dStart < index) { // dragged down
                        settings.shifts = [
                            ...settings.shifts.slice(0, dStart),
                            ...settings.shifts.slice(dStart + 1, index + 1),
                            settings.shifts[dStart],
                            ...settings.shifts.slice(index + 1),
                        ];

                        this.#store.ui.set("settings", settings);
                    } else if (dStart > index) { // dragged up 
                        settings.shifts = [
                            ...settings.shifts.slice(0, index),
                            settings.shifts[dStart],
                            ...settings.shifts.slice(index, dStart),
                            ...settings.shifts.slice(dStart + 1),
                        ];

                        this.#store.ui.set("settings", settings);
                    }

                    [...this.tbody.children].forEach((/**@type{HTMLElement}*/c) => {
                        c.style.background = "inherit";
                        c.style.color = "inherit";
                        return
                    });

                    dStart = null;
                }, // }}}
            });
        });
    } // }}}

    /** 
     * @private
     * @param {Shift} shift
     */
    createTableActions(shift) { // {{{
        const td = document.createElement("td");
        td.style.textAlign = "right";

        const container = new ui.wc.FlexGridRow();
        container.style.justifyContent = "flex-end";
        container.setAttribute("gap", "0.25rem");

        // Edit Button
        let item = new ui.wc.FlexGridItem();
        item.setAttribute("flex", "0");
        container.appendChild(item);

        let btn = new ui.wc.IconButton();
        btn.setAttribute("ghost", "");
        btn.onclick = async () => {
            const dialog = new dialogs.EditShiftDialog(shift, this.#store, this.#lang);
            document.body.appendChild(dialog);
            dialog.ui.open(true);
            dialog.ui.events.on("close", () => {
                document.body.removeChild(dialog);
            });
        };
        btn.appendChild(new ui.wc.svg.Edit2());
        item.appendChild(btn);

        // Delete Button
        item = new ui.wc.FlexGridItem();
        item.setAttribute("flex", "0");
        container.appendChild(item);

        btn = new ui.wc.IconButton();
        btn.setAttribute("color", "destructive");
        btn.setAttribute("ghost", "");
        btn.onclick = async () => {
            // TODO: Delete this shift from settings data, and rerender the table?
        };
        btn.appendChild(new ui.wc.svg.DeleteRecycleBin());
        item.appendChild(btn);

        td.appendChild(container);

        return td;
    } // }}}

    /**
     * @private
     * @param {Shift} shift
     */
    createTableShortName(shift) { // {{{
        const td = document.createElement("td");
        td.style.textAlign = "left";
        td.style.color = shift.color || "inherit";
        td.innerText = `${shift.visible ? shift.shortName : ""}`;
        return td;
    } // }}}

    /**
     * @private
     * @param {Shift} shift
     */
    createTableName(shift) { // {{{
        let td = document.createElement("td");
        td.style.textAlign = "left";
        td.innerText = `${shift.name}`;
        return td;
    } // }}}

    /**
     * @private
     */
    onLang() { // {{{{
        [...this.querySelectorAll("thead th")].forEach((th, i) => {
            switch (i) {
                case 0:
                    th.innerHTML = this.#lang.ui.get(
                        "settings", "shiftsTableHeaderName");
                    break
                case 1:
                    th.innerHTML = this.#lang.ui.get(
                        "settings", "shiftsTableHeaderShortName");
                    break
            }
        });
    } // }}}

    /**
     * @private
     * @param {SettingsStore} settings
     */
    onSettings(settings) { // {{{
        this.renderShiftsTable(settings)
    } // }}}
}
