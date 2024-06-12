import {
    UIFlexGrid,
    UIFlexGridItem,
    UIFlexGridRow,
    UIStackLayoutPage
} from "ui";
import { html } from "ui/src/js";
import {
    EditRhythm,
    IndexedDBBrowser,
    ShiftAddButton,
    ShiftsBackup,
    ShiftsTable,
    StartDate,
    ThemePicker,
    WeekStart
} from "./sections";

/**
 * @typedef {import("../../types").UIStoreEvents} UIStoreEvents
 */

// {{{ HTML content
const content = html`
    <ui-flex-grid
        class="no-scrollbar"
        style="
            padding: 0.25rem;
            padding-top: var(--ui-app-bar-height);
            overflow-y: auto;
            height: 100%;
        "
        gap="0.25rem"
    >
        <!-- "Miscellaneous" Section -->
        <ui-flex-grid-row>
            <ui-flex-grid-item class="is-card">
                <h3 id="miscTitle" class="title"></h3>

                <hr />

                <!-- week-start settings -->
                <section id="miscWeekStartSection"></section>

                <hr />

                <!-- theme settings -->
                <section id="miscThemePickerSection"></section>
            </ui-flex-grid-item>
        </ui-flex-grid-row>

        <!-- "Shifts" Section -->
        <ui-flex-grid-row>
            <ui-flex-grid-item class="is-card">
                <h3 id="shiftsTitle" class="title"></h3>

                <hr />

                <!-- data table -->
                <section id="shiftsTable"></section>

                <!-- add a shift button -->
                <section id="shiftsAddSection"></section>

                <hr />

                <!-- start date input -->
                <section id="shiftsStartDateSection"></section>

                <hr />

                <!-- edit rhythm (open dialog button) -->
                <section id="shiftsEditRhythmSection"></section>

                <hr />

                <!-- backup import/export -->
                <section id="shiftsBackupSection"></section>
            </ui-flex-grid-item>
        </ui-flex-grid-row>

        <ui-flex-grid-row>
            <ui-flex-grid-item class="is-card">
                <h3 id="indexedDBTitle" class="title"></h3>

                <!-- indexeddb-browser (open page) -->
                <section id="indexedDBBrowserSection"></section>
        </ui-flex-grid-row>
    </ui-flex-grid>
`;
// }}}

export class SettingsPage extends UIStackLayoutPage {
    /** @type {import("ui").UIStore<UIStoreEvents>} */
    #store
    /** @type {import("ui").UILang} */
    #lang

    static register = () => { // {{{
        UIFlexGrid.register();
        UIFlexGridRow.register();
        UIFlexGridItem.register();

        StartDate.register();
        EditRhythm.register();
        ShiftsTable.register();
        ShiftAddButton.register();
        WeekStart.register();
        ThemePicker.register();
        ShiftsBackup.register();
        IndexedDBBrowser.register();

        customElements.define("settings-page", SettingsPage);
    }; // }}}

    constructor() { // {{{
        super();
        this.innerHTML = content;

        this.ui.name = "settings";

        this.#store = document.querySelector("ui-store")
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

    /** @private */
    createMiscElements() { // {{{
        this.querySelector("#miscWeekStartSection").appendChild(
            new WeekStart(this.#store, this.#lang)
        );

        this.querySelector("#miscThemePickerSection").appendChild(
            new ThemePicker(this.#store, this.#lang)
        );
    } // }}}

    /** @private */
    createShiftElements() { // {{{
        this.querySelector("#shiftsStartDateSection").appendChild(
            new StartDate(this.#store, this.#lang)
        );

        this.querySelector("#shiftsEditRhythmSection").appendChild(
            new EditRhythm(this.#store, this.#lang)
        );

        this.querySelector("#shiftsTable").appendChild(
            new ShiftsTable(this.#store, this.#lang)
        );

        this.querySelector("#shiftsAddSection").appendChild(
            new ShiftAddButton(this.#store, this.#lang)
        )

        this.querySelector("#shiftsBackupSection").appendChild(
            new ShiftsBackup(this.#store, this.#lang)
        );
    } // }}}

    /** @private */
    createIndexedDBElements() { // {{{
        this.querySelector("#indexedDBBrowserSection").appendChild(
            new IndexedDBBrowser(this.#store, this.#lang)
        );
    } // }}}

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
