import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { html } from "ui/src/js/utils";
import db from "../../../db";
import utils from "../../../utils";

/**
 * @typedef {import("../../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc").Label} Button
 *
 * @typedef {import("../../../types").Backup} Backup
 * @typedef {import("../../../types").SettingsStore} SettingsStore
 */

const innerHTML = html`
    <ui-label>
        <ui-flex-grid-row gap="0.25rem">
            <!-- import -->
            <ui-flex-grid-item>
                <ui-button name="import" variant="full" color="secondary"></ui-button>
            </ui-flex-grid-item>

            <!-- export -->
            <ui-flex-grid-item>
                <ui-button name="export" variant="full" color="secondary"></ui-button>
            </ui-flex-grid-item>
        </ui-flex-grid-row>
    </ui-label>
`;

export class ShiftsBackup extends HTMLElement {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () => customElements.define("settings-shifts-backup", ShiftsBackup);

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        this.#store = store;
        this.#lang = lang;

        this.cleanup = [];

        /** @type {Label} */
        this.label = this.querySelector("ui-label")

        /** @type {Button} */
        this.importButton = this.querySelector(`ui-button[name="import"]`)
        this.importButton.onclick = async () => this.importBackup();

        /** @type {Button} */
        this.exportButton = this.querySelector(`ui-button[name="export"]`)
        this.exportButton.onclick = async () => this.exportBackup();
    } // }}}

    connectedCallback() { // {{{
        setTimeout(() => {
            this.cleanup.push(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
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
            indexedDB: {
                version: db.version,
                data: await db.getAll(),
            },
        };

        if (utils.isAndroid()) this.androidExport(backup);
        else this.browserExport(backup);
    } // }}}

    /**
     * @private
     * @param {FileReader} r
     * */
    async readerOnLoad(r) { // {{{
        // TODO: Add translation support for alerts?

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

            if (!!data.indexedDB) {
                if (typeof data.indexedDB.version !== "number") {
                    alert(`Invalid backup database version`);
                    return;
                }

                if (data.indexedDB.version > db.version) {
                    alert(`Invalid backup database version number "${data.indexedDB.version}", current version in use is "${data.indexedDB.version}"`)
                    return;
                }

                // Handle indexedDB - validate all entries
                for (let i = 0; i < (data.indexedDB.data || []).length; i++) {
                    if (!db.validate(data.indexedDB.version, data.indexedDB.data[i])) {
                        alert(`Data validation failed for:\n${JSON.stringify(data.indexedDB.data[i], null, 4)}`);
                        return;
                    }
                }
            }

            // Handle indexedDB - add/put to database
            await db.deleteAll();

            if (!!data.indexedDB) {
                for (const entry of data.indexedDB.data || []) {
                    db.add(entry).catch(() => db.put(entry));
                }
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
    onLang() { // {{{
        this.label.ui.primary = this.#lang.ui.get(
            "settings", "label-primary-shifts-backup",
        );

        this.importButton.innerHTML = this.#lang.ui.get(
            "settings", "button-import",
        );

        this.exportButton.innerHTML = this.#lang.ui.get(
            "settings", "button-export",
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
