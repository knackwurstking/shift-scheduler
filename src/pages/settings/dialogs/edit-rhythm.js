import ui from "ui"

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Button} Button
 */

export class EditRhythmDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    /** @type {Button} */
    #submitButton

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

        this.#createActionButtons()
        this.#createContent()

        this.cleanup = []
    }

    connectedCallback() {
        super.connectedCallback()

        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", () => {
                    this.ui.title = this.#lang.ui.get("settings", "shiftsEditRhythmDialogTitle")
                    this.#submitButton.innerText = this.#lang.ui.get("settings", "shiftsEditRhythmDialogSubmitButton")
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

        // TODO: Adding "click" handler, save rhythm to settings (store)

        this.appendChild(this.#submitButton)
    }

    #createContent() {
        // TODO: add rhythm edit table and shift picker
    }
}
