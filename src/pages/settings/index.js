import { Filesystem, Encoding, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import ui from "ui"
import { constants } from "../../lib";
import * as utils from "../../utils";
import * as types from "../../types";

export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {import("../../app").App | null} */
    #app = null;
    #initialized = false;

    #onLang = async () => {
        if (!this.app.language.getLanguage()) return;

        // AppBar Section

        this.appBar.title.innerHTML = this.app.language.get("settings", "appBarTitle")

        // Misc Section

        this.misc.title.innerHTML =
            this.app.language.get("settings", "miscTitle");
        this.misc.weekStartPrimary.innerHTML =
            this.app.language.get("settings", "miscWeekStartPrimary");
        this.misc.weekStartSecondary.innerHTML =
            this.misc.theme.innerHTML =
            this.app.language.get("settings", "miscWeekStartSecondary");
        this.app.language.get("settings", "miscTheme");

        // Backup Section

        this.backup.title.innerHTML =
            this.app.language.get("settings", "backupTitle");
        this.backup.importButton.innerHTML =
            this.app.language.get("settings", "backupImportButton");
        this.backup.exportButton.innerHTML =
            this.app.language.get("settings", "backupExportButton");

        // Shifts Section

        this.shifts.title.innerHTML =
            this.app.language.get("settings", "shiftsTitle");
        this.shifts.tableHeaderName.innerHTML =
            this.app.language.get("settings", "shiftsTableHeaderName");
        this.shifts.tableHeaderShortName.innerHTML =
            this.app.language.get("settings", "shiftsTableHeaderShortName");
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

    #onBackupImport = () => this.importBackup();
    #onBackupExport = () => this.exportBackup();


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
            title: this.querySelector("#backupTitle"),
            /** @type {import("ui/src/wc/button").Button} */
            importButton: this.querySelector("#backupImportButton"),
            /** @type {import("ui/src/wc/button").Button} */
            exportButton: this.querySelector("#backupExportButton"),
        }

        this.shifts = {
            title: this.querySelector("#shiftsTitle"),
            /** @type {HTMLTableElement} */
            tableHeaderName: this.querySelector("#shiftsTableHeaderName"),
            tableHeaderShortName: this.querySelector("#shiftsTableHeaderShortName"),
            tableBody: this.querySelector("#shiftsTableBody"),
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

            // Handle the shifts table
            this.#createShiftsTable()
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

    async importBackup() {
        const input = document.createElement("input");

        input.type = "file";

        input.onchange = async () => {
            const reader = new FileReader();
            reader.onload = () => this.#readerOnLoad(reader);
            reader.onerror = () => this.#readerOnError(reader);
            reader.readAsText(input.files[0]);
        };

        input.click();
    }

    async exportBackup() {
        /** @type {import("../../types").Backup} */
        const backup = {
            settings: this.app.storage.get("shift-settings", types.shiftSettings),
            indexedDB: await this.app.db.getAll(),
        };

        if (utils.isAndroid()) this.#androidExport(backup);
        else this.#browserExport(backup);
    }

    #createShiftsTable() {
        const tbody = this.shifts.tableBody;

        // TODO: render body data...
        // ...
    }

    /**
     * @param {FileReader} r
     */
    async #readerOnLoad(r) {
        switch (typeof r.result) {
            case "string":
                try {
                    /** @type {import("../../types").Backup} */
                    const data = JSON.parse(r.result);

                    // Handle settings
                    if (data.settings) {
                        if (!this.#validateSettings(data.settings))
                            throw `invalid settings`;

                        this.app.storage.set("shift-settings", data.settings)
                    }

                    // Handle indexedDB - validate all entries
                    for (const entry of (data.indexedDB || [])) {
                        if (!this.app.db.validate(entry)) {
                            alert(`Data validation failed for:\n${JSON.stringify(entry, null, 4)}`);
                            return;
                        }

                        mergeDataShiftsToSettings(entry.data);
                    }

                    // Handle indexedDB - add/put to database
                    //await this.app.db.deleteAll() // TODO: merge or delete all indexedDB data?
                    let y, m, entry;
                    for (entry of data.indexedDB) {
                        [y, m] = entry.id.split("/", 2).map(n => parseInt(n, 10))
                        this.app.db.add(y, m, entry.data)
                            .catch(() => this.app.db.put(y, m, entry.data));
                    }

                    // TODO: Trigger a reload the setttings page storage table (last html section)
                    // ...
                } catch (err) {
                    alert(`Import data failed!\nerror: ${err}`);
                }

                break;
            default:
                alert("Wrong data!");
        }
    }

    /**
     * @param {import("../../types").ShiftSettings} settings
     */
    #validateSettings(settings) {
        if (!Array.isArray(settings?.shifts) || !Array.isArray(settings?.rhythm)) {
            return false;
        }

        if (typeof settings.startDate !== "string") {
            return false;
        }

        return true;
    }

    /**
     * @param {FileReader} r
     */
    async #readerOnError(r) {
        alert(`Import data: read file failed: ${r.error}`);
    }

    /**
     * @param {import("../../types").Backup} data
     */
    async #androidExport(data) {
        const fileName = await this.#getBackupFileName()
        const today = new Date();
        const pM = (today.getMonth() + 1).toString().padStart(2, "0");
        const pD = today.getDate().toString().padStart(2, "0");

        Share.share({
            title: `${today.getFullYear()}-${pM}-${pD} Backup`,
            url: (await Filesystem.writeFile({
                path: fileName,
                data: JSON.stringify(data),
                encoding: Encoding.UTF8,
                directory: Directory.Cache,
            })).uri,
            dialogTitle: `Backup "${fileName}"`,
        });
    }

    /**
     * @param {import("../../types").Backup} data
     */
    async #browserExport(data) {
        const blob = new Blob([JSON.stringify(data)], {
            type: "octet/stream",
        });

        const anchor = document.createElement("a");

        anchor.setAttribute("href", window.URL.createObjectURL(blob));
        anchor.setAttribute("download", await this.#getBackupFileName());

        anchor.click();
    }

    async #getBackupFileName() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        return `shift-scheduler-backup_${today.getFullYear()}-${month}-${date}.json`;
    }
}

/**
 * @param {import("../../types").DBEntryData} data
 */
export async function mergeDataShiftsToSettings(data) {
    // TODO: Add shift(s) in data to storage "shift-settings", if they are missing
}
