import ui from "ui"

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Button} Button
 */

const contentHTML = `
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

    /** @type {HTMLDivElement} */
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
                    this.ui.title = this.#lang.ui.get("settings", "shiftsEditRhythmDialogTitle")
                    this.#submitButton.innerText = this.#lang.ui.get("settings", "shiftsEditRhythmDialogSubmitButton")
                    // TODO: set `this.#content` table header "name" (first child) and "shortName" (second child)
                }, true),
            )
        })
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.cleanup.forEach(fn => fn())
        this.cleanup = []
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
        this.#content = document.createElement("div")
        this.#content.style.width = "100%"
        this.#content.style.height = "100%"
        this.#content.innerHTML = contentHTML

        const tbody = this.#content.querySelector("tbody")
        // TODO: render table - current shift rhythm

        this.appendChild(this.#content)
    }
}
