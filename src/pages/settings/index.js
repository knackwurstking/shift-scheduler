import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import ui from "ui";
import { db } from "../../lib";
import * as utils from "../../utils";

export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {import("ui/src/wc").Store} */
    #store
    /** @type {import("ui/src/wc").Lang} */
    #lang

    constructor() {
        super();

        /** @type {(() => void)[]} */
        this.cleanup = []

        /** @type {import("ui/src/wc").Store} */
        this.#store = document.querySelector("ui-store")
        /** @type {import("ui/src/wc").Lang} */
        this.#lang = document.querySelector("ui-lang")

        this.appBar = {
            title: document.querySelector("#appBarTitle"),
        };

        this.misc = {
            title: this.querySelector("#miscTitle"),
            weekStartPrimary: this.querySelector("#miscWeekStartPrimary"),
            theme: this.querySelector("#miscTheme"),
            /** @type {HTMLInputElement} */
            weekStartInput: this.querySelector("#miscWeekStartInput"),
            /** @type {import("ui/src/wc/input").Select} */
            themeModeSelect: this.querySelector("#miscThemeModeSelect"),
            debugModePrimary: this.querySelector("#miscDebugModePrimary"),
            /** @type {HTMLInputElement} */
            debugModeInput: this.querySelector("#miscDebugModeInput"),
        };

        this.shifts = {
            title: this.querySelector("#shiftsTitle"),
            /** @type {HTMLTableElement} */
            tableHeaderName: this.querySelector("#shiftsTableHeaderName"),
            tableHeaderShortName: this.querySelector(
                "#shiftsTableHeaderShortName",
            ),
            tableBody: this.querySelector("#shiftsTableBody"),
            addButton: this.querySelector("#shiftsAddButton"),

            /** @type {import("ui/src/wc").Primary} */
            backupLabelPrimary: this.querySelector("#shiftsBackupLabelPrimary"),
            /** @type {import("ui/src/wc/button").Button} */
            backupImportButton: this.querySelector("#shiftsBackupImportButton"),
            /** @type {import("ui/src/wc/button").Button} */
            backupExportButton: this.querySelector("#shiftsBackupExportButton"),
        };
    }

    connectedCallback() {
        setTimeout(() => {
            this.cleanup.push(
                this.#store.data.on("lang", this.#onLang.bind(this), true)
            );


            // Week Start 
            (async () => {
                const cb = this.#onWeekStartChange.bind(this);

                this.misc.weekStartInput.checked = this.#store.data.get("week-start") === 1;
                this.misc.weekStartInput.addEventListener("click", cb)
                this.cleanup.push(() => {
                    this.misc.weekStartInput.removeEventListener("click", cb)
                });
            })();

            // Theme
            /** @param {import("../../types").ThemeStore} theme */
            (async (theme) => {
                [...this.misc.themeModeSelect.items].forEach(
                    (/** @type {import("ui/src/wc").SelectOption} */ c) => {
                        c.selected = (c.value === theme.mode)
                    }
                )

                this.misc.themeModeSelect.addEventListener(
                    "change",
                    /**
                     * @param {CustomEvent<import("ui/src/wc/input").SelectOption>} ev
                     */
                    (ev) => {
                        this.#store.data.update("theme", (theme) => ({ ...theme, mode: ev.detail.value }));
                    }
                );
            })(this.#store.data.get("theme"));


            // Debug
            (async () => {
                const cb = this.#onDebugModeChange.bind(this);

                this.misc.debugModeInput.checked = this.#store.data.get("debug");
                this.misc.debugModeInput.addEventListener("change", cb);
                this.cleanup.push(() => {
                    this.misc.debugModeInput.removeEventListener("change", cb);
                });
            })();

            // Backup
            (async () => {
                this.shifts.backupImportButton.addEventListener(
                    "click", this.#onBackupImport.bind(this),
                );

                this.shifts.backupExportButton.addEventListener(
                    "click", this.#onBackupExport.bind(this),
                );
            })();

            // Handle the shifts table
            this.#createShiftsTable();
        });
    }

    disconnectedCallback() {
        this.cleanup.forEach(fn => fn())
        this.cleanup = []
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
            settings: this.#store.data.get("settings"),
            indexedDB: await db.getAll(),
        };

        if (utils.isAndroid()) this.#androidExport(backup);
        else this.#browserExport(backup);

    }
    async #createShiftsTable() {
        // @ts-expect-error
        const template = this.querySelector("template#shiftsTableData").content;
        const tbody = this.shifts.tableBody;
        while (!!tbody.firstChild) tbody.removeChild(tbody.firstChild)

        /** @type {import("../../types").SettingsStore} */
        const settings = this.#store.data.get("settings");

        /** @type {import("../../types").Shift} */
        let shift;
        /** @type {HTMLTableCellElement} */
        let node;
        /** @type {HTMLElement} */
        let child2
        for (shift of settings.shifts) {
            node = template.cloneNode(true);
            node.querySelector("td:nth-child(1)").innerHTML = `${shift.name}`;

            child2 = node.querySelector("td:nth-child(2)")
            child2.innerHTML = `${shift.visible ? shift.shortName : ""}`;
            child2.style.color = shift.color || "inherit"

            node.querySelector("td:nth-child(3)").innerHTML = "[E] [D]";

            tbody.appendChild(node);
        }
    }

    /**
     * @param {FileReader} r
     */
    async #readerOnLoad(r) {
        if (typeof r.result !== "string") {
            alert("Wrong data!");
            return
        }

        try {
            /** @type {import("../../types").Backup} */
            const data = JSON.parse(r.result);

            // Handle settings
            if (data.settings) {
                if (!this.#validateSettings(data.settings))
                    throw `invalid settings`;

                this.#store.data.set("settings", data.settings);
            }

            // Handle indexedDB - validate all entries
            for (const entry of data.indexedDB || []) {
                if (!db.validate(entry)) {
                    alert(`Data validation failed for:\n${JSON.stringify(entry, null, 4)}`);
                    return;
                }

                //mergeDataShiftsToSettings(entry.data);
            }

            // Handle indexedDB - add/put to database
            //await this.app.db.deleteAll() // TODO: merge or delete all indexedDB data?
            let y, m, entry;
            for (entry of data.indexedDB || []) {
                [y, m] = entry.id.split("/", 2).map((n) => parseInt(n, 10));
                db.add(y, m, entry.data).catch(() => db.put(y, m, entry.data));
            }

            // NOTE: Do a complete settings page reload, the easy way
            //       to update everything :)
            this.disconnectedCallback()
            this.connectedCallback()
        } catch (err) {
            alert(`Import data failed!\nerror: ${err}`);
        }
    }

    /**
     * @param {import("../../types").Settings} settings
     */
    #validateSettings(settings) {
        if (
            !Array.isArray(settings?.shifts) ||
            !Array.isArray(settings?.rhythm)
        ) {
            return false;
        }

        if (typeof settings.startDate !== "string") {
            return false;
        }

        let d;
        for (d of settings.shifts) {
            if (!utils.validateShift(d)) {
                return false;
            }
        }

        for (d of settings.rhythm) {
            if (typeof d !== "number") {
                return false;
            }
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
        const fileName = await this.#getBackupFileName();
        const today = new Date();
        const pM = (today.getMonth() + 1).toString().padStart(2, "0");
        const pD = today.getDate().toString().padStart(2, "0");

        Share.share({
            title: `${today.getFullYear()}-${pM}-${pD} Backup`,
            url: (
                await Filesystem.writeFile({
                    path: fileName,
                    data: JSON.stringify(data),
                    encoding: Encoding.UTF8,
                    directory: Directory.Cache,
                })
            ).uri,
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

    /**
     * @param {import("../../types").LangStore} lang
     */
    async #onLang(lang) {
        console.log(`[settings] language update`, lang)

        if (!this.#lang.data.langType) return;

        // AppBar Section

        this.appBar.title.innerHTML = this.#lang.data.get(
            "settings", "appBarTitle"
        );

        // Misc Section

        this.misc.title.innerHTML = this.#lang.data.get(
            "settings", "miscTitle"
        );
        this.misc.weekStartPrimary.innerHTML = this.#lang.data.get(
            "settings", "miscWeekStartPrimary",
        );
        this.misc.theme.innerHTML = this.#lang.data.get(
            "settings", "miscTheme",
        );
        this.misc.debugModePrimary.innerHTML = this.#lang.data.get(
            "settings", "miscDebugModePrimary",
        );

        // Backup Section

        this.shifts.backupLabelPrimary.innerHTML = this.#lang.data.get(
            "settings", "shiftsBackupLabelPrimary",
        );
        this.shifts.backupImportButton.innerHTML = this.#lang.data.get(
            "settings", "shiftsBackupImportButton",
        );
        this.shifts.backupExportButton.innerHTML = this.#lang.data.get(
            "settings", "shiftsBackupExportButton",
        );

        // Shifts Section

        this.shifts.title.innerHTML = this.#lang.data.get(
            "settings", "shiftsTitle",
        );
        this.shifts.tableHeaderName.innerHTML = this.#lang.data.get(
            "settings", "shiftsTableHeaderName",
        );
        this.shifts.tableHeaderShortName.innerHTML = this.#lang.data.get(
            "settings", "shiftsTableHeaderShortName",
        );
        this.shifts.addButton.innerHTML = this.#lang.data.get(
            "settings", "shiftsAddButton",
        );
    }

    /** @param {Event & { currentTarget: HTMLInputElement }} ev */
    async #onWeekStartChange(ev) {
        this.#store.data.set("week-start", ev.currentTarget.checked ? 1 : 0);
    }

    /** @param {Event & { currentTarget: HTMLInputElement }} ev */
    async #onDebugModeChange(ev) {
        this.#store.data.set("debug", ev.currentTarget.checked);
    }

    async #onBackupImport() {
        await this.importBackup();
    }

    async #onBackupExport() {
        await this.exportBackup();
    }
}
