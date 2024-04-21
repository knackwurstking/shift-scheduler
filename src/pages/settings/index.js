import ui from "ui"
import { constants } from "../../lib";
import * as utils from "../../utils";

export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {import("../../app").App | null} */
    #app = null;
    #initialized = false;

    #onLang = async () => {
        if (!this.app.language.getLanguage()) return;

        this.appBar.title.innerHTML = this.app.language.get("settings", "appBarTitle")

        this.misc.title.innerHTML =
            this.app.language.get("settings", "miscTitle");

        this.misc.weekStartPrimary.innerHTML =
            this.app.language.get("settings", "miscWeekStartPrimary");

        this.misc.weekStartSecondary.innerHTML =
            this.app.language.get("settings", "miscWeekStartSecondary");

        this.misc.theme.innerHTML =
            this.app.language.get("settings", "miscTheme");

        this.backup.importButton.innerHTML =
            this.app.language.get("settings", "backupImportButton");

        this.backup.exportButton.innerHTML =
            this.app.language.get("settings", "backupExportButton");
    };

    #onWeekStartChange = (ev) => {
        this.app.storage.set(
            "week-start",
            ev.currentTarget.checked
                ? 1
                : 0
        );
    }

    /**
     * @param {CustomEvent<import("ui/src/wc/input").SelectOption>} ev
     */
    #onThemeModeSelectChange = (ev) => {
        utils.setTheme(
            {
                ...this.app.storage.get(
                    "theme",
                    constants.theme
                ),
                mode: ev.detail.value
            },
            this.app
        );
    };

    #onBackupImport = () => {
        // TODO: Read json data backup
    }

    #onBackupExport = () => {
        // TODO: Create json data for backup
    }

    constructor() {
        super();

        this.appBar = {
            title: document.querySelector("#appBarTitle"),
        };

        this.misc = {
            title: this.querySelector("#miscTitle"),
            weekStartPrimary: this.querySelector("#miscWeekStartPrimary"),
            weekStartSecondary: this.querySelector("#miscWeekStartSecondary"),
            theme: this.querySelector("#miscTheme"),

            /** @type {HTMLInputElement} */
            weekStartInput: this.querySelector("#miscWeekStartInput"),

            /** @type {import("ui/src/wc/input").Select} */
            themeModeSelect: this.querySelector("#miscThemeModeSelect"),
        };

        this.backup = {
            /** @type {import("ui/src/wc/button").Button} */
            importButton: this.querySelector("#backupImportButton"),
            /** @type {import("ui/src/wc/button").Button} */
            exportButton: this.querySelector("#backupExportButton"),
        }
    }

    get app() {
        return this.#app;
    }

    set app(app) {
        this.#app = app;

        if (super.isConnected && !this.#initialized) {
            this.#initialized = true;

            // Handle language
            this.#app.storage.addListener("lang", this.#onLang);
            this.#onLang();

            // Select current active theme
            [...this.misc.themeModeSelect.children].forEach(c => {
                const theme = this.app.storage.get("theme", constants.theme);
                if (!!theme) {
                    // @ts-ignore
                    if (c.value === theme.mode) {
                        c.setAttribute("selected", "")
                    } else {
                        c.removeAttribute("selected")
                    }
                }
            });

            // Select current week-start checked
            this.misc.weekStartInput.checked = !!(
                this.app.storage.get("week-start", constants.weekStart) === 1
            );

            // Handle week-start change
            this.misc.weekStartInput.addEventListener("click", this.#onWeekStartChange)

            // Handle theme change
            this.misc.themeModeSelect.addEventListener("change", this.#onThemeModeSelectChange);

            // Handle backup import/export
            this.backup.importButton.addEventListener("click", this.#onBackupImport);
            this.backup.exportButton.addEventListener("click", this.#onBackupExport);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (!!this.app) {
            this.app = this.app;
        }
    }

    disconnectedCallback() {
        super.connectedCallback();
        this.#initialized = false;

        if (!!this.app) {
            this.#app.storage.removeListener("lang", this.#onLang);
            this.misc.weekStartInput.removeEventListener("click", this.#onWeekStartChange)
            this.misc.themeModeSelect.removeEventListener("change", this.#onThemeModeSelectChange);
            this.backup.importButton.removeEventListener("click", this.#onBackupImport);
            this.backup.exportButton.removeEventListener("click", this.#onBackupExport);
        }
    }
}
