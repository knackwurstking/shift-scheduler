import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import ui from "ui";
import db from "../../db";
import utils from "../../utils";
import * as dialogs from "./dialogs";
import * as sections from "./sections";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Select} Select
 * @typedef {import("ui/src/wc").Primary} Primary
 * @typedef {import("ui/src/wc").Button} Button 
 * @typedef {import("ui/src/wc").SelectOption} SelectOption
 *
 * @typedef {import("../../types").ThemeStore} ThemeStore 
 * @typedef {import("../../types").SettingsStore} SettingsStore 
 * @typedef {import("../../types").LangStore} LangStore 
 * @typedef {import("../../types").WeekStartStore} WeekStartStore
 * @typedef {import("../../types").Shift} Shift 
 * @typedef {import("../../types").Backup} Backup
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
    };

    constructor() { // {{{
        super();

        /** @type {(() => void)[]} */
        this.cleanup = []

        /** @type {Store} */
        this.#store = document.querySelector("ui-store")
        /** @type {Lang} */
        this.#lang = document.querySelector("ui-lang")
    } // }}}

    connectedCallback() { // {{{
        console.debug("[settings] connect...")

        setTimeout(() => {
            this.misc = this.createMiscElements();
            this.shifts = this.createShiftElements();

            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
                this.#store.ui.on("week-start", this.onWeekStart.bind(this), true),
                this.#store.ui.on("theme", this.onTheme.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        console.debug("[settings] disconnect...")

        this.cleanup.forEach(fn => fn())
        this.cleanup = []
    } // }}}

    async importBackup() { // {{{
        const input = document.createElement("input");

        input.type = "file";

        input.onchange = async () => {
            const reader = new FileReader();
            reader.onload = () => this.readerOnLoad(reader);
            reader.onerror = () => {
                alert(`Import data: read file failed: ${reader.error}`);
            }
            reader.readAsText(input.files[0]);
        };

        input.click();
    } // }}}

    async exportBackup() { // {{{
        /** @type {Backup} */
        const backup = {
            settings: this.#store.ui.get("settings"),
            indexedDB: await db.getAll(),
        };

        if (utils.isAndroid()) this.androidExport(backup);
        else this.browserExport(backup);

    } // }}}

    /** @private */
    createMiscElements() { // {{{
        /** @type {HTMLInputElement} */
        const weekStartInput = this.querySelector("#miscWeekStartInput");
        weekStartInput.onclick = (/**@type{MouseEvent & { currentTarget: HTMLInputElement }}*/ev) =>
            this.#store.ui.set("week-start", ev.currentTarget.checked ? 1 : 0);

        /** @type {Select} */
        const themeModeSelect = this.querySelector("#miscThemeModeSelect");
        this.cleanup.push(
            themeModeSelect.ui.events.on("change", (option) => {
                console.debug(`[settings] update theme mode:`, option);
                this.#store.ui.update("theme", (theme) => ({ ...theme, mode: option.ui.value }));
            })
        );

        /** @type {Select} */
        const themeSelect = this.querySelector("#miscThemeSelect");
        this.cleanup.push(
            themeSelect.ui.events.on("change", (option) => {
                console.debug(`[settings] update theme name:`, option);
                this.#store.ui.update("theme", (theme) => ({ ...theme, name: option.ui.value }));
            })
        );

        return {
            title: this.querySelector("#miscTitle"),

            /** @type {Label} */
            weekStart: this.querySelector("#miscWeekStart"),
            weekStartInput: weekStartInput,

            theme: this.querySelector("#miscTheme"),
            themeModeSelect,
            themeSelect,
        };
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

        this.querySelector("#shiftsAddButton").appendChild(
            new sections.ShiftAddButton(this.#store, this.#lang)
        )

        /** @type {Button} */
        const backupImportButton = this.querySelector("#shiftsBackupImportButton");
        backupImportButton.onclick = async () => {
            this.importBackup()
        };

        /** @type {Button} */
        const backupExportButton = this.querySelector("#shiftsBackupExportButton");
        backupExportButton.onclick = async () => {
            this.exportBackup()
        };

        return {
            title: this.querySelector("#shiftsTitle"),

            /** @type {Label} */
            backup: this.querySelector("#shiftsBackup"),
            backupImportButton,
            backupExportButton,
        };
    } // }}}

    /**
     * @private
     * @param {FileReader} r
     * */
    async readerOnLoad(r) { // {{{
        if (typeof r.result !== "string") {
            alert("Wrong data!");
            return
        }

        try {
            /** @type {Backup} */
            const data = JSON.parse(r.result);

            // Handle settings
            if (data.settings) {
                if (!validateSettings(data.settings))
                    throw `invalid settings`;

                this.#store.ui.set("settings", data.settings);
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
        } catch (err) {
            alert(`Import data failed!\nerror: ${err}`);
        }
    } // }}}

    /**
     * @private
     * @param {Backup} data
     */
    async androidExport(data) { // {{{
        const fileName = await this.getBackupFileName();
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
    } // }}}

    /**
     * @private
     * @param {Backup} data
     */
    async browserExport(data) { // {{{
        const blob = new Blob([JSON.stringify(data)], {
            type: "octet/stream",
        });

        const anchor = document.createElement("a");

        anchor.setAttribute("href", window.URL.createObjectURL(blob));
        anchor.setAttribute("download", await this.getBackupFileName());

        anchor.click();
    } // }}}

    /** @private */
    async getBackupFileName() { // {{{
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        return `shift-scheduler-backup_${today.getFullYear()}-${month}-${date}.json`;
    } // }}}

    /** @private */
    async onLang() { // {{{
        if (!this.#lang.ui.langType) return;

        // Misc Section

        this.misc.title.innerHTML = this.#lang.ui.get(
            "settings", "miscTitle"
        );
        this.misc.weekStart.ui.primary = this.#lang.ui.get(
            "settings", "miscWeekStartPrimary",
        );
        this.misc.theme.innerHTML = this.#lang.ui.get(
            "settings", "miscTheme",
        );

        // Backup Section

        this.shifts.backup.ui.primary = this.#lang.ui.get(
            "settings", "shiftsBackupPrimary",
        );
        this.shifts.backupImportButton.innerHTML = this.#lang.ui.get(
            "settings", "shiftsBackupImportButton",
        );
        this.shifts.backupExportButton.innerHTML = this.#lang.ui.get(
            "settings", "shiftsBackupExportButton",
        );

        // Shifts Section

        this.shifts.title.innerHTML = this.#lang.ui.get(
            "settings", "shiftsTitle",
        );
    } // }}}

    /**
     * @private
     * @param {WeekStartStore} weekStart
     */
    async onWeekStart(weekStart) { // {{{
        this.misc.weekStartInput.checked = weekStart === 1;
    } // }}}

    /**
     * @private
     * @param {ThemeStore} theme
     */
    async onTheme(theme) { // {{{
        console.debug(`[settings] onTheme`, theme);

        [...this.misc.themeModeSelect.children].forEach(
            (/** @type {SelectOption} */ c) => {
                c.ui.selected = (c.ui.value === theme.mode)
            }
        );

        [...this.misc.themeSelect.children].forEach(
            (/** @type {SelectOption} */ c) => {
                c.ui.selected = (c.ui.value === theme.name)
            }
        );
    } // }}}
}

/** @param {SettingsStore} settings */
function validateSettings(settings) { // {{{
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
} // }}}
