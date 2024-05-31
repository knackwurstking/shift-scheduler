import ui from "ui";
import * as dialogs from "../../dialogs";
import * as sections from "./sections";
import { IndexedDBBrowserPage } from "../indexeddb-browser";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
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
        // TODO: Register indexeddb section here...
        IndexedDBBrowserPage.register();
    };

    constructor() { // {{{
        super();

        /** @type {Store} */
        this.#store = document.querySelector("ui-store")
        /** @type {Lang} */
        this.#lang = document.querySelector("ui-lang")

        /**
         * @private
         * @type {StackLayout}
         */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.createMiscElements();
        this.createShiftElements();
        this.createIndexedDBElements();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        this.stackLayout.ui.registerPage("indexeddb", () => {
            const page = new ui.wc.StackLayoutPage(); // TODO: Replace with custom page
            return page;
        });

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        super.disconnectedCallback();
        this.stackLayout.ui.unregisterPage("indexeddb");
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
        // TODO: Add new section named "Indexed DB", contains a goto ("View") button
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
    } // }}}
}
