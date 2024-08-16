import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { CleanUp, html, isAndroid } from "ui";
import { db, utils } from "../../../../lib";

/**
 * HTML: `settings-shifts-backup`
 */
export class SettingsShiftsBackup extends HTMLElement {
    static register = () => {
        customElements.define("settings-shifts-backup", SettingsShiftsBackup);
    };

    constructor() {
        super();

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.label;
        this.buttonImport;
        this.buttonExport;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-label>
                <ui-flex-grid-row gap="0.25rem">
                    <!-- import -->
                    <ui-flex-grid-item>
                        <ui-button
                            name="import"
                            variant="full"
                            color="secondary"
                        ></ui-button>
                    </ui-flex-grid-item>

                    <!-- export -->
                    <ui-flex-grid-item>
                        <ui-button
                            name="export"
                            variant="full"
                            color="secondary"
                        ></ui-button>
                    </ui-flex-grid-item>
                </ui-flex-grid-row>
            </ui-label>
        `;

        /** @type {import("ui").UILabel} */
        this.label = document.querySelector("ui-label");

        /** @type {import("ui").UIButton} */
        this.buttonImport = this.querySelector(`ui-button[name="import"]`);
        this.buttonImport.onclick = async () => await this.importHandler();

        /** @type {import("ui").UIButton} */
        this.buttonExport = this.querySelector(`ui-button[name="export"]`);
        this.buttonExport.onclick = async () => await this.exportHandler();
    }

    connectedCallback() {
        this.cleanup.add(
            this.uiStore.ui.on("lang", this.storeLangHandler.bind(this), true),
        );
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    /** @private */
    async importHandler() {
        const input = document.createElement("input");

        input.type = "file";

        input.onchange = async () => {
            const reader = new FileReader();
            reader.onload = () => this.readerOnLoadHandler(reader);
            reader.onerror = () => {
                alert(`Import data: read file failed: ${reader.error}`);
            };
            reader.readAsText(input.files[0]);
        };

        input.click();
    }

    /** @private */
    async exportHandler() {
        /** @type {Settings_BackupV1} */
        const backup = {
            settings: this.uiStore.ui.get("settings"),
            indexedDB: {
                version: db.version,
                data: await db.getAll(),
            },
        };

        if (isAndroid()) this.androidExport(backup);
        else this.browserExport(backup);
    }

    /**
     * @private
     * @param {FileReader} r
     */
    async readerOnLoadHandler(r) {
        if (typeof r.result !== "string") {
            alert(this.uiLang.ui.get("backup-alerts", "invalid-data"));
            return;
        }

        try {
            /** @type {Settings_BackupV1 & Settings_BackupV0} */
            const data = JSON.parse(r.result);

            // Handle settings
            if (Object.hasOwn(data, "settings")) {
                if (!validateSettings(data.settings)) {
                    alert(
                        this.uiLang.ui.get("backup-alerts", "invalid-settings"),
                    );
                    return;
                }

                this.uiStore.ui.set("settings", data.settings);
            }

            // NOTE: Support for v1.4.0 - v1.5.3
            if (Object.hasOwn(data, "storage")) {
                data.indexedDB = convertStorage(data.storage); // Yes, this will overwrite all existing indexedDB stuff.
            }

            // Handle indexedDB data
            if (Object.hasOwn(data, "indexedDB")) {
                if (typeof data.indexedDB.version !== "number") {
                    alert(
                        this.uiLang.ui
                            .get("backup-alerts", "invalid-version-type")
                            .replace("%v", `${typeof data.indexedDB.version}`),
                    );
                    return;
                }

                if (
                    data.indexedDB.version > db.version ||
                    data.indexedDB.version < 0
                ) {
                    alert(
                        this.uiLang.ui
                            .get("backup-alerts", "invalid-version-number")
                            .replace("%d", data.indexedDB.version.toString())
                            .replace("%d", db.version.toString()),
                    );
                    return;
                }

                for (let i = 0; i < (data.indexedDB.data || []).length; i++) {
                    if (
                        !db.validate(
                            data.indexedDB.version,
                            data.indexedDB.data[i],
                        )
                    ) {
                        alert(
                            this.uiLang.ui
                                .get("backup-alerts", "invalid-indexed-entry")
                                .replace(
                                    "%s",
                                    JSON.stringify(
                                        data.indexedDB.data[i],
                                        null,
                                        4,
                                    ),
                                ),
                        );
                        return;
                    }
                }
            }

            await db.deleteAll();
            if (Object.hasOwn(data, "indexedDB")) {
                for (const entry of data.indexedDB.data || []) {
                    db.add(entry).catch(() => db.put(entry));
                }
            }
        } catch (err) {
            alert(`Import failed: ${err}`);
        }
    }

    /**
     * @private
     * @param {Settings_BackupV1} data
     */
    async androidExport(data) {
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
    }

    /**
     * @private
     * @param {Settings_BackupV1} data
     */
    async browserExport(data) {
        const blob = new Blob([JSON.stringify(data)], {
            type: "octet/stream",
        });

        const anchor = document.createElement("a");

        anchor.setAttribute("href", window.URL.createObjectURL(blob));
        anchor.setAttribute("download", await this.getBackupFileName());

        anchor.click();
    }

    /** @private */
    async getBackupFileName() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        return `shift-scheduler-backup_${today.getFullYear()}-${month}-${date}.json`;
    }

    /** @private */
    async storeLangHandler() {
        this.label.ui.primary = this.uiLang.ui.get(
            "settings",
            "label-primary-shifts-backup",
        );

        this.buttonImport.innerHTML = this.uiLang.ui.get(
            "settings",
            "button-import",
        );

        this.buttonExport.innerHTML = this.uiLang.ui.get(
            "settings",
            "button-export",
        );
    }
}

/** @param {SchedulerStore_Settings} settings */
function validateSettings(settings) {
    if (!Array.isArray(settings?.shifts) || !Array.isArray(settings?.rhythm)) {
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
 * @param {BackupV0_Storage} data
 * @returns {BackupV1_IndexedDB}
 */
function convertStorage(data) {
    /**
     * @param {any} data
     * @returns {boolean}
     */
    const validate = (data) => {
        try {
            for (const [k, v] of Object.entries(data)) {
                if (typeof k === "string") {
                    const [y, m, d] = k
                        .split("-", 3)
                        .map((n) => parseInt(n, 10));

                    if (isNaN(y) || isNaN(m) || isNaN(d)) {
                        return false;
                    }

                    if (m < 0 || m > 11) {
                        return false;
                    }

                    if (
                        !Object.hasOwn(v, "shift") ||
                        !Object.hasOwn(v, "note")
                    ) {
                        return false;
                    }

                    if (v.shift !== null) {
                        if (!utils.validateShift(v.shift)) {
                            return false;
                        }
                    }

                    // check "note"
                    if (typeof v.note !== "string") {
                        v.note = "";
                    }

                    indexedDB.data.push({
                        year: y,
                        month: m,
                        date: d,
                        shift: v.shift,
                        note: v.note,
                    });
                }
            }
        } catch {
            return false;
        }

        return true;
    };

    /**
     * @type {BackupV1_IndexedDB}
     */
    const indexedDB = {
        version: 1,
        data: [],
    };

    // Validate data and convert to new indexedDB data
    for (const [k, v] of Object.entries(data)) {
        if (!validate(v)) {
            throw `invalid data for "${k}"`;
        }
    }

    return indexedDB;
}
