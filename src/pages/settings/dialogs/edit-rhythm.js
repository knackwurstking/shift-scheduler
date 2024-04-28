import ui from "ui"

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 */

export class EditRhythmDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang
    /** @type {HTMLSpanElement} */
    #title = document.createElement("span")

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

        this.#title.slot = "title"
        this.appendChild(this.#title)

        this.#createActionButtons()
        this.#createContent()

        this.cleanup = []
    }

    connectedCallback() {
        super.connectedCallback()

        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", () => {
                    this.#title.innerText = this.#lang.ui.get("settings", "shiftsEditRhythmDialogTitle")
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
        // TODO: Add Submit button to the "actions" slot
    }

    #createContent() {
        // TODO: add rhythm edit table and shift picker
    }
}
