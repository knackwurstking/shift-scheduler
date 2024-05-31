import ui from "ui";
import * as dialogs from "../../dialogs";
import * as sections from "./sections";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 */

export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () => {
        customElements.define("settings-page", SettingsPage);
        dialogs.EditRhythmDialog.register();
        dialogs.EditShiftDialog.register();
        sections.StartDate.register();
        sections.EditRhythm.register();
        sections.ShiftsTable.register();
        sections.ShiftAddButton.register();
        sections.WeekStart.register();
        sections.ThemePicker.register();
        sections.ShiftsBackup.register();
        sections.IndexedDBBrowser.register();
    };

    constructor() { // {{{
        super();

        /** @type {Store} */
        this.#store = document.querySelector("ui-store")
        /** @type {Lang} */
        this.#lang = document.querySelector("ui-lang")

        this.createMiscElements();
        this.createShiftElements();
        this.createIndexedDBElements();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        super.disconnectedCallback();
    } // }}}

    /** @private */
    createMiscElements() { // {{{
        this.querySelector("#miscWeekStartSection").appendChild(
            new sections.WeekStart(this.#store, this.#lang)
        );

        this.querySelector("#miscThemePickerSection").appendChild(
            new sections.ThemePicker(this.#store, this.#lang)
        );
    } // }}}

    /** @private */
    createShiftElements() { // {{{
        this.querySelector("#shiftsStartDateSection").appendChild(
            new sections.StartDate(this.#store, this.#lang)
        );

        this.querySelector("#shiftsEditRhythmSection").appendChild(
            new sections.EditRhythm(this.#store, this.#lang)
        );

        this.querySelector("#shiftsTable").appendChild(
            new sections.ShiftsTable(this.#store, this.#lang)
        );

        this.querySelector("#shiftsAddSection").appendChild(
            new sections.ShiftAddButton(this.#store, this.#lang)
        )

        this.querySelector("#shiftsBackupSection").appendChild(
            new sections.ShiftsBackup(this.#store, this.#lang)
        );
    } // }}}

    /** @private */
    createIndexedDBElements() {
        this.querySelector("#indexedDBBrowserSection").appendChild(
            new sections.IndexedDBBrowser(this.#store, this.#lang)
        );
    }

    /** @private */
    async onLang() { // {{{
        // Misc Title 

        this.querySelector("#miscTitle").innerHTML = this.#lang.ui.get(
            "settings", "title-misc"
        );

        // Shifts Title 

        this.querySelector("#shiftsTitle").innerHTML = this.#lang.ui.get(
            "settings", "title-shifts",
        );

        this.querySelector("#indexedDBTitle").innerHTML =
            this.#lang.ui.get("settings", "title-indexedDB");
    } // }}}
}
