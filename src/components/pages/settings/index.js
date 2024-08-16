import { CleanUp, html, styles, UIStackLayoutPage } from "ui";
import { pages } from "../../../data/constants";
import {
    SettingsEditRhythm,
    SettingsIndexedDBBrowser,
    SettingsShiftAddButton,
    SettingsShiftsBackup,
    SettingsShiftsTable,
    SettingsStartDate,
    SettingsThemePicker,
    SettingsWeekStart,
} from "./sections";

/**
 * HTML: `settings-page`
 */
export class SettingsPage extends UIStackLayoutPage {
    static register = () => {
        SettingsEditRhythm.register();
        SettingsIndexedDBBrowser.register();
        SettingsShiftAddButton.register();
        SettingsShiftsBackup.register();
        SettingsShiftsTable.register();
        SettingsStartDate.register();
        SettingsThemePicker.register();
        SettingsWeekStart.register();

        customElements.define("settings-page", SettingsPage);
    };

    constructor() {
        super(pages.settings);

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-flex-grid
                class="no-scrollbar"
                style="${styles({
                    padding: "0.25rem",
                    paddingTop: "var(--ui-app-bar-height)",
                    overflowY: "auto",
                    height: "100%",
                })}"
                gap="0.25rem"
            >
                <!-- "Miscellaneous" Section -->
                <ui-flex-grid-item class="is-card">
                    <h3 id="miscTitle" class="title"></h3>

                    <hr />

                    <section>
                        <settings-week-start></settings-week-start>
                    </section>

                    <hr />

                    <section>
                        <settings-theme-picker></settings-theme-picker>
                    </section>
                </ui-flex-grid-item>

                <!-- "Shifts" Section -->
                <ui-flex-grid-item class="is-card">
                    <h3 id="shiftsTitle" class="title"></h3>

                    <hr />

                    <!-- data table -->
                    <section>
                        <settings-shifts-table></settings-shifts-table>
                    </section>

                    <!-- add a shift button -->
                    <section>
                        <settings-shift-add-button></settings-shift-add-button>
                    </section>

                    <hr />

                    <!-- start date input -->
                    <section>
                        <settings-start-date></settings-start-date>
                    </section>

                    <hr />

                    <!-- edit rhythm (open dialog button) -->
                    <section>
                        <settings-edit-rhythm></settings-edit-rhythm>
                    </section>

                    <hr />

                    <!-- backup import/export -->
                    <section>
                        <settings-shifts-backup></settings-shifts-backup>
                    </section>
                </ui-flex-grid-item>

                <!-- "DBBrowser" Section -->
                <ui-flex-grid-item class="is-card">
                    <h3 id="indexedDBTitle" class="title"></h3>

                    <!-- indexeddb-browser (open page) -->
                    <section>
                        <settings-indexeddb-browser></settings-indexeddb-browser>
                    </section>
                </ui-flex-grid-item>
            </ui-flex-grid>
        `;
    }

    connectedCallback() {
        super.connectedCallback();

        this.cleanup.add(
            this.uiStore.ui.on("lang", this.storeHandlerLang.bind(this), true),
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanup.run();
    }

    /** @private */
    async storeHandlerLang() {
        this.querySelector("#miscTitle").innerHTML = this.uiLang.ui.get(
            "settings",
            "title-misc",
        );

        this.querySelector("#shiftsTitle").innerHTML = this.uiLang.ui.get(
            "settings",
            "title-shifts",
        );

        this.querySelector("#indexedDBTitle").innerHTML = this.uiLang.ui.get(
            "settings",
            "title-indexedDB",
        );
    }
}
