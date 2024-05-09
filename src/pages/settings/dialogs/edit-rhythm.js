import ui from "ui"
import { html } from "ui/src/js/utils"
import { ShiftCard } from "../../../components"

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").FlexGrid} FlexGrid
 *
 * @typedef {import("../../../types").SettingsStore} SettingsStore
 */

// {{{ Content HTML

const contentHTML = html`
<ui-flex-grid-item class="no-scrollbar" style="height: 100%; overflow-y: scroll;">
    <table>
        <thead>
            <tr>
                <th style="text-align: left;"></th>
                <th style="text-align: left;"></th>
                <th style="text-align: right;"></ht>
            </tr>
        </thead>

        <tbody>
        </tbody>
    </table>
</ui-flex-grid-item>

<ui-flex-grid-item style="position: relative; max-height: 1.6rem;">
    <hr
        style="
            position: absolute;
            top: var(--ui-spacing);
            left: 0;
            width: 100%;
        "
    />

    <ui-secondary
        style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            display: block;
            text-align: center;
            background-color: var(--ui-bgColor);
            padding: 0 var(--ui-spacing);
            white-space: nowrap;
        "
    >...</ui-secondary>
</ui-flex-grid-item>

<ui-flex-grid-item
    class="picker"
    flex="0"
    style="
        max-height: fit-content;
        position: relative;
    "
>
    <ui-flex-grid-row
        class="shifts no-scrollbar"
        style="
            width: 100%;
            height: fit-content;
            overflow: hidden;
            overflow-x: scroll;
        "
        gap="0.25rem"
    ></ui-flex-grid-row>
</ui-flex-grid-item>
`

// }}}

export class EditRhythmDialog extends ui.wc.Dialog {
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
        this.#store.ui.update("settings", (settings) => {
            return {
                ...settings,
                rhythm: this.#rhythm,
            };
        });
        this.ui.close();
    };

    /** @type {FlexGrid} */
    #content;

    /** @type {number[]} */
    #rhythm;

    static register = () => customElements.define("edit-rhythm-dialog", EditRhythmDialog);

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super()
        this.#store = store
        this.#lang = lang

        this.ui.fullscreen = true

        this.cleanup = []
        this.createActionButtons()
        this.createContent()
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback()

        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
                this.#store.ui.on("settings", this.onSettings.bind(this), true),
            )
        })
    } // }}}

    disconnectedCallback() { // {{{
        super.disconnectedCallback()

        this.cleanup.forEach(fn => fn())
        this.cleanup = []
    } // }}}

    /**
     * @private
     * @param {SettingsStore} settings
     */
    renderTable(settings) { // {{{
        const tbody = this.#content.querySelector("tbody");
        while (!!tbody.firstChild) tbody.removeChild(tbody.firstChild);

        let draggedIndex = null;
        this.#rhythm.forEach((id, index) => {
            const shift = settings.shifts.find(shift => shift.id === id)
            if (!shift) {
                console.error(`shift with id of "${id}" is missing in shifts`)
                return
            }

            // Create a table entry for this shift
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="text-align: left;">${shift.name}</td>
                <td
                    style="text-align: left; color: ${shift.color || 'inherit'};"
                >${!!shift.visible ? shift.shortName : ""}</td>
                <td style="text-align: right;">
                    <ui-flex-grid-row style="justify-content: flex-end;" gap="0.25rem">
                        <ui-flex-grid-item flex="0">
                            <ui-icon-button color="destructive" ghost>
                                <ui-svg-delete-recycle-bin></ui-svg-delete-recycle-bin>
                            </ui-icon-button>
                        </ui-flex-grid-item>
                    </ui-flex-grid-row>
                </td>
            `;

            // @ts-ignore
            tr.querySelector("ui-icon-button:nth-child(1)").onclick = async () => {
                tbody.removeChild(tr);
                this.#rhythm = this.#rhythm.filter((_n, i) => i !== index);
                this.renderTable(settings)
            };

            tbody.appendChild(tr)

            ui.js.draggable.create(tr, {
                onDragStart: async () => { // {{{
                    draggedIndex = index
                }, // }}}

                onDragging: async () => { // {{{
                    if (draggedIndex === null) return;

                    [...tbody.children].forEach((/**@type{HTMLElement}*/child, ci) => {
                        if (ci !== index) {
                            child.style.background = "inherit"
                            child.style.color = "inherit"
                            return
                        }

                        child.style.background = "var(--ui-primary-bgColor)"
                        child.style.color = "var(--ui-primary-color)"
                    });
                }, // }}}

                onDragEnd: async () => { // {{{
                    if (draggedIndex === null) return

                    if (draggedIndex < index) { // dragged down
                        this.#rhythm = [
                            ...this.#rhythm.slice(0, draggedIndex),
                            ...this.#rhythm.slice(draggedIndex + 1, index + 1),
                            this.#rhythm[draggedIndex],
                            ...this.#rhythm.slice(index + 1),
                        ];

                        this.renderTable(settings)
                    } else if (draggedIndex > index) { // dragged up
                        this.#rhythm = [
                            ...this.#rhythm.slice(0, index),
                            this.#rhythm[draggedIndex],
                            ...this.#rhythm.slice(index, draggedIndex),
                            ...this.#rhythm.slice(draggedIndex + 1),
                        ]

                        this.renderTable(settings)
                    }

                    [...tbody.children].forEach((/**@type{HTMLElement}*/child) => {
                        child.style.background = "inherit"
                        child.style.color = "inherit"
                        return
                    });

                    draggedIndex = null
                }, // }}}
            });
        });
    } // }}}

    /**
     * Add a `ShiftCard` for each shift in `settings.shifts` to the `shiftsPicker` element
     *
     * @private
     * @param {SettingsStore} settings
     */
    renderShiftsPicker(settings) { // {{{
        const picker = this.#content.querySelector(".picker .shifts");
        while (picker.firstChild) picker.removeChild(picker.firstChild);

        settings.shifts.forEach(shift => {
            const item = new ui.wc.FlexGridItem();
            item.innerHTML = `
                <shift-card color="${!!shift.visible ? (shift.color || 'inherit') : 'transparent'}">
                    <span slot="name">${shift.name}</span>
                    <span slot="short-name">${shift.shortName}</span>
                </shift-card>
            `;

            // @ts-ignore
            item.querySelector("shift-card").onclick = () => {
                this.#rhythm.push(shift.id);
                this.renderTable(settings)
            };

            picker.appendChild(item);
        });
    } // }}}

    /** @private */
    createActionButtons() { // {{{
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
    createContent() { // {{{
        this.#content = new ui.wc.FlexGrid()
        this.#content.style.width = "100%"
        this.#content.style.height = "100%"
        this.#content.innerHTML = contentHTML
        this.appendChild(this.#content)
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.ui.title = this.#lang.ui.get("settings", "dialogEditRhythmTitle");

        // Name
        this.#content.querySelector("thead th:nth-child(1)").innerHTML =
            this.#lang.ui.get("settings", "shiftsTableHeaderName");

        // Short
        this.#content.querySelector("thead th:nth-child(2)").innerHTML =
            this.#lang.ui.get("settings", "shiftsTableHeaderShortName");

        // Dialog Picker Line
        this.#content.querySelector("ui-secondary").innerHTML =
            this.#lang.ui.get("settings", "shiftsEditRhythmDialogPicker");

        this.#cancelButton.innerText = this.#lang.ui.get("general", "cancelButton");
        this.#submitButton.innerText = this.#lang.ui.get("general", "submitButton");
    } // }}}

    /**
     * @private
     * @param {SettingsStore} settings
     */
    async onSettings(settings) { // {{{
        this.#rhythm = [...settings.rhythm]
        this.renderTable(settings)
        this.renderShiftsPicker(settings)
    } // }}}
}
