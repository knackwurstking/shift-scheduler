import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import * as jspdf from "jspdf";
import autoTable from "jspdf-autotable";
import ui from "ui";
import * as calendarUtils from "../pages/calendar/utils";
import utils, { html } from "../utils";

/**
 * @typedef {import("ui/src/wc/dialog").DialogEvents} DialogEvents
 * @typedef {import("ui/src/wc").Store<import("../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").FlexGrid} FlexGrid
 *
 * @typedef {import("../types").DBDataEntry} DBDataEntry
 * @typedef {import("../types").Shift} Shift
 */

const flexGridContent = html`
    <ui-flex-grid-item class="picker"></ui-flex-grid-item>
`;

/** @extends {ui.wc.Dialog<DialogEvents>} */
export class PDFDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {Button} */
    #downloadButton;
    /** @type {() => void|Promise<void>} */
    #onDownload = () => {
        // TODO: Add fullscreen spinner until export pdf is done
        const c = new Date(this.#store.ui.get("date-picker"));
        createPDF({
            year: c.getFullYear(),
        });

        this.ui.close();
    };

    static register = () => customElements.define("pdf-dialog", PDFDialog);

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();

        this.#store = store;
        this.#lang = lang;

        this.cleanup = [];

        this.createContent();
        this.createActions();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        setTimeout(() => {
            this.#store.ui.on("lang", this.onLang.bind(this), true);
        });
    } // }}}

    disconnectedCallback() { // {{{
        super.disconnectedCallback();
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new ui.wc.FlexGrid();

        content.setAttribute("gap", "0.5rem");
        content.innerHTML = flexGridContent;

        this.createPicker(content);

        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} content
     */
    createPicker(content) { // {{{
        const picker = content.querySelector(".picker");
        picker.innerHTML = `
            <ui-secondary>Pick a Year</ui-secondary>
            <input
                style="width: 100%;"
                type="number"
                value="${new Date(this.#store.ui.get('date-picker')).getFullYear()}"
            >
        `;

        const year = picker.querySelector("input");
        year.oninput = () => {
            if (isNaN(parseInt(year.value, 10))) {
                year.setAttribute("aria-invalid", "");
                this.#downloadButton.setAttribute("disabled", "");
            } else {
                year.removeAttribute("aria-invalid");
                this.#downloadButton.removeAttribute("disabled");
            }
        }
    } // }}}

    /** @private */
    createActions() { // {{{
        // Close Button
        let item = new ui.wc.FlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="primary"></ui-button>
        `;
        this.#downloadButton = item.querySelector("ui-button");
        this.#downloadButton.onclick = this.#onDownload;
        this.appendChild(item)
    } // }}}

    /** @private */
    onLang() { // {{{
        this.ui.title = this.#lang.ui.get("pdf-dialog", "title");

        this.#downloadButton.innerText =
            this.#lang.ui.get("pdf-dialog", "button-download");
    } // }}}
}

/**
 * @param {Object} options
 * @param {number | null} [options.year]
 * @param {number | null} [options.month]
 */
async function createPDF({ year = null, month = null }) { // {{{
    /**
     * @param {number} month
     * @param {DBDataEntry[]} a
     */
    const getRow = (month, a) => { // {{{
        // TODO: Add options like `useLongName`
        return a.slice(0, 7).map(a => {
            const name = a.shift?.visible
                ? (a.shift?.shortName || "")
                : "";

            return a.month === month
                ? (
                    !name
                        ? `\n${a.date}\n`
                        : `${a.date}\n--\n${name}`
                ) : "\n\n";
        });
    } // }}}

    const today = new Date();
    if (month === null && year === null) month = today.getMonth();
    if (year === null) year = today.getFullYear();

    const doc = new jspdf.jsPDF();
    doc.setFont("Courier");

    const months = month !== null ? [month] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let pageIndex = 0;
    for (const month of months) {
        if (pageIndex === 2) {
            doc.addPage();
            pageIndex = 1;
        } else {
            pageIndex++;
        }

        const mA = await calendarUtils.getArray(year, month, document.querySelector("ui-store"));
        // TODO: Add database stuff using map

        autoTable(doc, {
            // TODO: Handle week start
            head: [
                [
                    {
                        // TODO: Add table header showing the current month
                        content: "Jannuar",
                        colSpan: 7,
                        styles: {
                            fillColor: [0, 0, 0],
                            textColor: [255, 255, 255]
                        }
                    }
                ], ['Sun', 'Mon', 'Thu', "Wed", "Thu", "Fri", "Ä, Ö"],
            ],
            body: [
                getRow(month, mA.slice(0, 7)),
                getRow(month, mA.slice(7, 14)),
                getRow(month, mA.slice(14, 21)),
                getRow(month, mA.slice(21, 28)),
                getRow(month, mA.slice(28, 35)),
                getRow(month, mA.slice(35, 42)),
            ],
            theme: "grid",
            styles: {
                valign: "middle",
                halign: "center",
                font: "Courier",
            },
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
            }
        });
    }

    await exportDoc(doc, 2024);
} // }}}

/**
 * @param {jspdf.jsPDF} doc
 * @param {number} year
 */
async function exportDoc(doc, year) { // {{{
    const fileName = `${year}.pdf`;

    if (utils.isAndroid()) {
        const result = await Filesystem.writeFile({
            path: fileName,
            // @ts-ignore
            data: doc.output("datauri"),
            //encoding: Encoding.UTF8,
            directory: Directory.Cache,
        });

        await Share.share({
            title: `${year}`,
            // @ts-ignore
            url: result.uri,
            dialogTitle: `Share "${fileName}"`,
        });

        return;
    }

    doc.save(fileName);
} // }}}
