import {
    SvgEdit,
    SvgRecycle,
    UIFlexGridItem,
    UIFlexGridRow,
    UIIconButton
} from "ui";
import { CleanUp, createDraggable, html } from "ui/src/js";
import { EditShiftDialog } from "../../../dialogs";

/**
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
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

    static register = () => {
        SvgEdit.register();
        SvgRecycle.register();

        UIIconButton.register();
        UIFlexGridRow.register();
        UIFlexGridItem.register();

        EditShiftDialog.register();

        customElements.define("settings-shifts-table", ShiftsTable, { extends: "table" })
    };

    /**
     * @param {import("ui").UIStore<UIStoreEvents>} store
     * @param {import("ui").UILang} lang
     */
    constructor(store, lang) { // {{{
        super();

        /** @type {import("ui").UIStore<UIStoreEvents>} */
        this.uiStore = store
        /** @type {import("ui").UILang} */
        this.uiLang = lang

        this.innerHTML = innerHTML;
        this.cleanup = new CleanUp();
        this.tbody = this.querySelector("tbody");
    } // }}}

    connectedCallback() { // {{{
        this.cleanup.add(
            this.uiStore.ui.on("lang", this.onLang.bind(this), true),
        );

        this.cleanup.add(
            this.uiStore.ui.on("settings", this.onSettings.bind(this), true),
        );
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
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
            createDraggable(tr, {
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

                        this.uiStore.ui.set("settings", settings);
                    } else if (dStart > index) { // dragged up 
                        settings.shifts = [
                            ...settings.shifts.slice(0, index),
                            settings.shifts[dStart],
                            ...settings.shifts.slice(index, dStart),
                            ...settings.shifts.slice(dStart + 1),
                        ];

                        this.uiStore.ui.set("settings", settings);
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
        td.innerHTML = `
            <ui-flex-grid-row style="justify-content: flex-end;" gap="0.25rem">
                <ui-flex-grid-item flex="0">
                    <ui-icon-button ghost><svg-edit></svg-edit></ui-icon-button>
                </ui-flex-grid-item>

                <ui-flex-grid-item flex="0">
                    <ui-icon-button color="destructive" ghost><svg-recycle></svg-recycle></ui-icon-button>
                </ui-flex-grid-item>
            </ui-flex-grid-row>
        `;

        /** @type {UIIconButton[]} */
        // @ts-ignore
        const [editButton, deleteButton] = [...td.querySelectorAll("ui-icon-button")]
        editButton.onclick = async () => { // {{{
            const dialog = new EditShiftDialog(shift, this.uiStore, this.uiLang);
            document.body.appendChild(dialog);

            dialog.ui.open(true);
            dialog.ui.events.on("close", () => {
                document.body.removeChild(dialog);
            });

            dialog.ui.events.on("submit", (shift) => {
                this.uiStore.ui.update("settings", (settings) => {
                    return {
                        ...settings,
                        shifts: settings.shifts.map(s => {
                            if (s.id === shift.id) {
                                return shift;
                            }

                            return s;
                        }),
                    };
                });
            })
        }; // }}}

        deleteButton.onclick = async () => { // {{{
            if (
                !window.confirm(
                    this.uiLang.ui.get(
                        "settings", "confirm-delete-shift"
                    ).replace("%s", shift.name)
                )
            ) {
                return
            };

            this.uiStore.ui.update("settings", (settings) => {
                return {
                    ...settings,
                    shifts: settings.shifts.filter(s => s.id !== shift.id),
                };
            });
        }; // }}}

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
                    th.innerHTML = this.uiLang.ui.get(
                        "settings", "table-header-name");
                    break
                case 1:
                    th.innerHTML = this.uiLang.ui.get(
                        "settings", "table-header-short-name");
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
