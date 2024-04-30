import ui from "ui"
import { ShiftCard } from "../../../components"

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").FlexGrid} FlexGrid
 *
 * @typedef {import("../../../types").Settings} Settings
 */

const contentHTML = `
<ui-flex-grid-item style="height: 100%;">
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

<ui-flex-grid-item
    class="picker"
    flex="0"
    style="min-height: 4.5em; position: relative;"
>
    <hr
        style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        "
    />

    <ui-secondary
        id="shiftsEditRhythmDialogPickerSecondary"
        style="
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            display: block;
            text-align: center;
            background-color: hsl(var(--bg));
            padding: 0 var(--spacing);
        "
    >...</ui-secondary>

    <div class="shifts"></div>
</ui-flex-grid-item>
`

export class EditRhythmDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    /** @type {Button} */
    #submitButton
    /** @type {() => void|Promise<void>} */
    #onSubmit = () => {
        // TODO: save rhythm to settings (store)
    }

    /** @type {FlexGrid} */
    #content

    static register = () => customElements.define("edit-rhythm-dialog", EditRhythmDialog)

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) {
        super()
        this.#store = store
        this.#lang = lang

        this.ui.fullscreen = true

        this.cleanup = []
        this.#createActionButtons()
        this.#createContent()
    }

    connectedCallback() {
        super.connectedCallback()

        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", () => {
                    this.ui.title = this.#lang.ui.get("settings", "shiftsEditRhythmDialogTitle");
                    this.#submitButton.innerText =
                        this.#lang.ui.get("settings", "shiftsEditRhythmDialogSubmitButton");

                    this.#content.querySelector("thead th:nth-child(1)").innerHTML =
                        this.#lang.ui.get("settings", "shiftsTableHeaderName");
                    this.#content.querySelector("thead th:nth-child(2)").innerHTML =
                        this.#lang.ui.get("settings", "shiftsTableHeaderShortName");

                    this.#content.querySelector("#shiftsEditRhythmDialogPickerSecondary").innerHTML =
                        this.#lang.ui.get("settings", "shiftsEditRhythmDialogPickerSecondary");
                }, true),

                this.#store.ui.on("settings", (settings) => {
                    this.#renderTable(settings)
                    this.#renderShiftsPicker(settings)
                }, true),
            )
        })
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.cleanup.forEach(fn => fn())
        this.cleanup = []
    }

    /**
     * @param {Settings} settings
     */
    #renderTable(settings) {
        settings?.rhythm.forEach((id) => {
            const tbody = this.#content.querySelector("tbody")
            while (!!tbody.firstChild) tbody.removeChild(tbody.firstChild)

            const shift = settings.shifts.find(shift => shift.id === id)
            if (!shift) {
                console.error(`shift with id of "${id}" is missing in shifts`)
                return
            }

            // Create a table entry for this shift
            const tr = document.createElement("tr")
            // TODO: Make table entries draggable?

            // Table Data Name
            const tdName = document.createElement("td")
            tdName.innerText = shift.name
            tr.appendChild(tdName)

            // Table Data Short Name
            const tdShortName = document.createElement("td")
            tdShortName.innerText = !!shift.visible ? shift.shortName : ""
            tdShortName.style.color = shift.color || "inherit"
            tr.appendChild(tdShortName)

            // Table Data Actions
            const tdActions = document.createElement("td")
            // TODO: Add remove button (X or Trash icon) to actions

            tr.appendChild(tdActions)

            tbody.appendChild(tr)
        })
    }

    /**
     * Add a `ShiftCard` for each shift in `settings.shifts` to the `shiftsPicker` element
     *
     * @param {Settings} settings
     */
    #renderShiftsPicker(settings) {
        settings.shifts.forEach(shift => {
            const picker = this.#content.querySelector(".picker .shifts")
            const card = new ShiftCard()
            card.setAttribute("color", shift.color || "transparent")
            card.innerHTML = `
                <span slot="name">${shift.name}</span>
                <span slot="short-name">${shift.shortName}</span>
            `
            picker.appendChild(card)
        })
    }

    #createActionButtons() {
        // Add Submit button to the "actions" slot
        this.#submitButton = new ui.wc.Button()
        this.#submitButton.slot = "actions"
        this.#submitButton.setAttribute("variant", "full")
        this.#submitButton.setAttribute("color", "primary")
        this.#submitButton.innerText = "" // set text in "lang" event handler

        this.#submitButton.addEventListener("click", this.#onSubmit)
        this.cleanup.push(() => this.#submitButton.removeEventListener("click", this.#onSubmit))

        this.appendChild(this.#submitButton)
    }

    #createContent() {
        this.#content = new ui.wc.FlexGrid()
        this.#content.style.width = "100%"
        this.#content.style.height = "100%"
        this.#content.innerHTML = contentHTML
        this.appendChild(this.#content)
    }
}
