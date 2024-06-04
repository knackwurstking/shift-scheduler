import * as ui from "ui";
import { CleanUp } from "ui/src/js";
import * as dialogs from "../../../dialogs";

/**
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../../types").Shift} Shift
 */

export class ShiftAddButton extends ui.UIButton {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    static register = () => customElements.define("settings-shift-add-button", ShiftAddButton)

    /**
     * @param {ui.UIStore<UIStoreEvents>} store
     * @param {ui.UILang} lang
     */
    constructor(store, lang) { // {{{
        super();
        super.setAttribute("color", "primary")
        super.setAttribute("variant", "full")

        this.#store = store;
        this.#lang = lang;

        this.cleanup = new CleanUp();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback()
        this.handleEvents()

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() {
        this.cleanup.run();
    }

    /** @private */
    handleEvents() { // {{{
        const onClose = async (/**@type{dialogs.EditShiftDialog}*/dialog) => { // {{{
            document.body.removeChild(dialog);
        } // }}}

        const onClick = () => { // {{{
            /** @type {Shift} */
            let shift = {
                id: new Date().getTime(),
                name: "",
                shortName: "",
                visible: true,
                color: null,
            };

            const dialog = new dialogs.EditShiftDialog(shift, this.#store, this.#lang);
            document.body.appendChild(dialog)

            dialog.ui.open(true);
            dialog.ui.events.on("close", () => onClose(dialog));

            /**
             * @param {Shift} newShift
             */
            const onSubmit = async (newShift) => { // {{{
                if (!newShift.name) {
                    alert(this.#lang.ui.get("edit-shift-alerts", "missing-name"));

                    shift = newShift;

                    const dialog = new dialogs.EditShiftDialog(shift, this.#store, this.#lang);
                    document.body.appendChild(dialog)

                    dialog.ui.open(true);
                    dialog.ui.events.on("close", () => onClose(dialog));
                    dialog.ui.events.on("submit", onSubmit);

                    return;
                }

                if (!newShift.shortName) {
                    newShift.shortName = newShift.name.slice(0, 2)
                }

                this.#store.ui.update("settings", (settings) => {
                    return {
                        ...settings,
                        shifts: [...settings.shifts, newShift],
                    };
                });
            }; // }}}

            dialog.ui.events.on("submit", onSubmit);
        } // }}}

        this.addEventListener("click", onClick);
        this.cleanup.add(() => this.removeEventListener("click", onClick));
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.innerHTML = this.#lang.ui.get("settings", "button-add-shift");
    } // }}}
} // }}}
