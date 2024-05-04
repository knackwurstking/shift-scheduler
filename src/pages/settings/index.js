import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import ui from "ui";
import db from "../../db";
import utils from "../../utils";
import { EditShiftDialog } from "./dialogs";
import { EditRhythm } from "./edit-rhythm";
import { StartDate } from "./start-date";

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
 * @typedef {import("../../types").Shift} Shift 
 * @typedef {import("../../types").Backup} Backup
 */

export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () => customElements.define("settings-page", SettingsPage)

    constructor() { // {{{
        super();

        /** @type {(() => void)[]} */
        this.cleanup = []

        /** @type {Store} */
        this.#store = document.querySelector("ui-store")
        /** @type {Lang} */
        this.#lang = document.querySelector("ui-lang")

        this.misc;
        this.shifts;

        { // {{{ query: misc, shifts
            this.misc = {
                title: this.querySelector("#miscTitle"),

                /** @type {Label} */
                weekStart: this.querySelector("#miscWeekStart"),
                /** @type {HTMLInputElement} */
                weekStartInput: this.querySelector("#miscWeekStartInput"),

                theme: this.querySelector("#miscTheme"),
                /** @type {Select} */
                themeModeSelect: this.querySelector("#miscThemeModeSelect"),
                /** @type {Select} */
                themeSelect: this.querySelector("#miscThemeSelect"),
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

                startDate: new StartDate(this.#store, this.#lang),
                editRhythm: new EditRhythm(this.#store, this.#lang),

                /** @type {Label} */
                backup: this.querySelector("#shiftsBackup"),
                /** @type {Button} */
                backupImportButton: this.querySelector("#shiftsBackupImportButton"),
                /** @type {Button} */
                backupExportButton: this.querySelector("#shiftsBackupExportButton"),
            };

            this.querySelector("#shiftsStartDateSection").appendChild(this.shifts.startDate)
            this.querySelector("#shiftsEditRhythmSection").appendChild(this.shifts.editRhythm)
        } // }}}
    } // }}}

    connectedCallback() { // {{{ store: "lang", "settings"
        console.debug("[settings] connect...")

        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this._onLang.bind(this), true),
                this.#store.ui.on("settings", async (settings) => {
                    this._renderShiftsTable(settings)
                }, true),
            );


            // {{{ Week Start Section (Misc)

            (async () => {
                const cb = this._onWeekStartChange.bind(this);

                this.misc.weekStartInput.checked = this.#store.ui.get("week-start") === 1;
                this.misc.weekStartInput.addEventListener("click", cb)
                this.cleanup.push(() => {
                    this.misc.weekStartInput.removeEventListener("click", cb)
                });
            })();

            // }}}

            // {{{ Theme Section (Misc)

            (async (/** @type {ThemeStore} */theme) => {
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

                /**
                 * @param {CustomEvent<SelectOption>} ev 
                 */
                const cbMode = (ev) => {
                    console.debug(`[settings] update theme mode:`, ev.detail);
                    this.#store.ui.update("theme", (theme) => ({ ...theme, mode: ev.detail.ui.value }));
                };
                this.misc.themeModeSelect.addEventListener("change", cbMode);
                this.cleanup.push(() => {
                    this.misc.themeModeSelect.removeEventListener("change", cbMode);
                })

                /**
                 * @param {CustomEvent<SelectOption>} ev 
                 */
                const cbName = (ev) => {
                    console.debug(`[settings] update theme name:`, ev.detail);
                    this.#store.ui.update("theme", (theme) => ({ ...theme, name: ev.detail.ui.value }));
                };
                this.misc.themeSelect.addEventListener("change", cbName);
                this.cleanup.push(() => {
                    this.misc.themeSelect.removeEventListener("change", cbName);
                })
            })(this.#store.ui.get("theme"));

            // }}}

            // {{{ Backup Section (Shifts) 

            (async () => {
                this.shifts.backupImportButton.onclick = async () => {
                    this.importBackup()
                };

                this.shifts.backupExportButton.onclick = async () => {
                    this.exportBackup()
                };
            })();

            // }}}
        });
    } // }}}

    disconnectedCallback() { // {{{ cleanup
        console.debug("[settings] disconnect...")

        this.cleanup.forEach(fn => fn())
        this.cleanup = []
    } // }}}

    async importBackup() { // {{{
        const input = document.createElement("input");

        input.type = "file";

        input.onchange = async () => {
            const reader = new FileReader();
            reader.onload = () => this._readerOnLoad(reader);
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

        if (utils.isAndroid()) this._androidExport(backup);
        else this._browserExport(backup);

    } // }}}

    /** @param {SettingsStore} settings */
    _renderShiftsTable(settings) { // {{{
        const tbody = this.shifts.tableBody;
        while (!!tbody.firstChild) tbody.removeChild(tbody.firstChild)

        let dStart = null
        settings.shifts.forEach((shift, index) => {
            const tr = document.createElement("tr")
            {
                // Shift Name
                /** @type {HTMLElement} */
                let td = document.createElement("td")
                td.style.textAlign = "left"
                td.innerText = `${shift.name}`
                tr.appendChild(td)

                // Shift Short Name
                td = document.createElement("td")
                td.style.textAlign = "left"
                td.style.color = shift.color || "inherit"
                td.innerText = `${shift.visible ? shift.shortName : ""}`;
                tr.appendChild(td)

                // Shift Actions 
                td = document.createElement("td");
                td.style.textAlign = "right"
                {
                    const container = new ui.wc.FlexGridRow();
                    container.style.justifyContent = "flex-end";
                    container.setAttribute("gap", "0.25rem")

                    // Edit Button
                    let item = new ui.wc.FlexGridItem()
                    item.setAttribute("flex", "0")
                    container.appendChild(item)
                    let btn = new ui.wc.IconButton()
                    btn.setAttribute("color", "primary")
                    btn.setAttribute("ghost", "")
                    btn.appendChild(new ui.wc.svg.Edit2())
                    btn.onclick = async () => {
                        // TODO: Open edit shift dialog for this table entry
                        const dialog = new EditShiftDialog(this.#store, this.#lang)
                        document.body.appendChild(dialog)
                        dialog.ui.open(true)
                        dialog.ui.events.addListener("close", () => {
                            document.body.removeChild(dialog)
                        })
                    };
                    item.appendChild(btn)

                    // Delete Button
                    item = new ui.wc.FlexGridItem()
                    item.setAttribute("flex", "0")
                    container.appendChild(item)
                    btn = new ui.wc.IconButton()
                    btn.setAttribute("color", "destructive")
                    btn.setAttribute("ghost", "")
                    btn.appendChild(new ui.wc.svg.DeleteRecycleBin())
                    btn.onclick = async () => {
                        // TODO: Delete this shift from settings data, and rerender the table?
                    };
                    item.appendChild(btn)

                    td.appendChild(container)
                }
                tr.appendChild(td)
            }

            tbody.appendChild(tr);

            // Draggable Setup
            ui.js.draggable.create(tr, {
                onDragStart: async () => {
                    dStart = index;
                },

                onDragging: async () => {
                    if (dStart === null) return;

                    [...tbody.children].forEach((/**@type{HTMLElement}*/c, ci) => {
                        if (index !== ci) {
                            c.style.background = "inherit";
                            c.style.color = "inherit";
                            return
                        }

                        c.style.background = "hsl(var(--primary))";
                        c.style.color = "hsl(var(--primary-fg))";
                    });
                },

                onDragEnd: async () => {
                    if (dStart === null) return;

                    if (dStart < index) { // dragged down
                        settings.shifts = [
                            ...settings.shifts.slice(0, dStart),
                            ...settings.shifts.slice(dStart + 1, index + 1),
                            settings.shifts[dStart],
                            ...settings.shifts.slice(index + 1),
                        ];

                        this.#store.ui.set("settings", settings);
                    } else if (dStart > index) { // dragged up 
                        settings.shifts = [
                            ...settings.shifts.slice(0, index),
                            settings.shifts[dStart],
                            ...settings.shifts.slice(index, dStart),
                            ...settings.shifts.slice(dStart + 1),
                        ];

                        this.#store.ui.set("settings", settings);
                    }

                    [...tbody.children].forEach((/**@type{HTMLElement}*/c) => {
                        c.style.background = "inherit";
                        c.style.color = "inherit";
                        return
                    });

                    dStart = null;
                },
            });
        })
    } // }}}

    /** @param {FileReader} r */
    async _readerOnLoad(r) { // {{{
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

            // NOTE: Do a complete settings page reload, the easy way
            //       to update everything :)
            this.disconnectedCallback()
            this.connectedCallback()
        } catch (err) {
            alert(`Import data failed!\nerror: ${err}`);
        }
    } // }}}

    /** @param {Backup} data */
    async _androidExport(data) { // {{{
        const fileName = await this._getBackupFileName();
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

    /** @param {Backup} data */
    async _browserExport(data) { // {{{
        const blob = new Blob([JSON.stringify(data)], {
            type: "octet/stream",
        });

        const anchor = document.createElement("a");

        anchor.setAttribute("href", window.URL.createObjectURL(blob));
        anchor.setAttribute("download", await this._getBackupFileName());

        anchor.click();
    } // }}}

    async _getBackupFileName() { // {{{
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        return `shift-scheduler-backup_${today.getFullYear()}-${month}-${date}.json`;
    } // }}}

    /** @param {LangStore} lang */
    async _onLang(lang) { // {{{
        console.debug(`[settings] language update`, lang)

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
        this.shifts.tableHeaderName.innerHTML = this.#lang.ui.get(
            "settings", "shiftsTableHeaderName",
        );
        this.shifts.tableHeaderShortName.innerHTML = this.#lang.ui.get(
            "settings", "shiftsTableHeaderShortName",
        );
        this.shifts.addButton.innerHTML = this.#lang.ui.get(
            "settings", "shiftsAddButton",
        );
    } // }}}

    /** @param {Event & { currentTarget: HTMLInputElement }} ev */
    async _onWeekStartChange(ev) { // {{{
        this.#store.ui.set("week-start", ev.currentTarget.checked ? 1 : 0);
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
