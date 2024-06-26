import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import * as jspdf from "jspdf";
import autoTable from "jspdf-autotable";
import {
    UIButton,
    UIDialog,
    UIFlexGrid,
    UIFlexGridItem,
    UIInput,
    UISpinner
} from "ui";
import { isAndroid } from "ui/src/js";
import db from "../db";
import * as calendarUtils from "../pages/calendar/utils";

/**
 * @typedef {import("ui/src/ui-input").UIInputEvents} UIInputEvents
 * @typedef {import("ui/src/ui-dialog").UIDialogEvents} UIDialogEvents
 * @typedef {import("../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../types").DBDataEntry} DBDataEntry
 * @typedef {import("../types").Shift} Shift
 */

const flexGridContent = `
    <ui-flex-grid-item class="picker"></ui-flex-grid-item>
`;

/** @extends {UIDialog<UIDialogEvents>} */
export class PDFDialog extends UIDialog {


    static register = () => {
        UIDialog.register();
        UIFlexGrid.register();
        UIFlexGridItem.register();
        UIButton.register();
        UISpinner.register();
        UIInput.register();

        if (!customElements.get("pdf-dialog")) {
            customElements.define("pdf-dialog", PDFDialog);
        }
    };

    /**
     * @param {import("ui").UIStore<UIStoreEvents>} store
     * @param {import("ui").UILang} lang
     */
    constructor(store, lang) { // {{{
        super();

        /** @type {import("ui").UIStore<UIStoreEvents>} */
        this.uiStore = store;
        /** @type {import("ui").UILang} */
        this.uiLang = lang;

        /** @type {import("ui").UIStackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        /**
         * @private
         * @type {UIInput<UIInputEvents, "number">}
         */
        this.year;

        /** @type {UIButton} */
        this.download;

        this.createContent();
        this.createActions();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        this.stackLayout.ui.lock();
        this.cleanup.add(() => this.stackLayout.ui.unlock());

        setTimeout(() => {
            this.cleanup.add(
                this.uiStore.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new UIFlexGrid();

        content.setAttribute("gap", "0.5rem");
        content.innerHTML = flexGridContent;

        this.createPicker(content);

        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {UIFlexGrid} content
     */
    createPicker(content) { // {{{
        const picker = content.querySelector(".picker");

        picker.innerHTML = `
            <ui-input
                type="number"
                value="${new Date(this.uiStore.ui.get('date-picker')).getFullYear()}"
            ></ui-input>
        `;

        this.year = picker.querySelector("ui-input");

        this.year.ui.events.on("input", (/** @type {number} */ value) => {
            if (isNaN(value) || value < 1900) {
                this.year.setAttribute("aria-invalid", "");
                this.download.setAttribute("disabled", "");
            } else {
                this.year.removeAttribute("aria-invalid");
                this.download.removeAttribute("disabled");
            }
        });
    } // }}}

    /** @private */
    createActions() { // {{{
        let item = new UIFlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="primary"></ui-button>
        `;
        this.download = item.querySelector("ui-button");
        this.download.onclick = this.onDownload.bind(this);
        this.appendChild(item)
    } // }}}

    async onDownload() {
        const spinner = new UISpinner();
        document.body.appendChild(spinner);

        setTimeout(async () => {
            try {
                const c = new Date(this.year.ui.value, 0);
                await createPDF({
                    year: c.getFullYear(),
                    lang: this.uiLang,
                    store: this.uiStore,
                });
            } finally {
                document.body.removeChild(spinner);
            }
        });

        this.ui.close();
    }

    /** @private */
    onLang() { // {{{
        this.ui.title = this.uiLang.ui.get("pdf-dialog", "title");

        this.year.ui.title = this.uiLang.ui.get("pdf-dialog", "input-title-year")

        this.download.innerText =
            this.uiLang.ui.get("pdf-dialog", "button-download");
    } // }}}
}

/**
 * @param {Object} options
 * @param {number | null} [options.year]
 * @param {number | null} [options.month]
 * @param {import("ui").UILang} options.lang
 * @param {import("ui").UIStore<UIStoreEvents>} options.store
 */
async function createPDF({ year = null, month = null, lang = null, store = null }) { // {{{
    /**
     * @param {number} month
     * @param {DBDataEntry[]} a
     * @returns {string[]}
     */
    const getRowFromArray = (month, a) => { // {{{
        return a.slice(0, 7).map((e) => {
            const name = e.shift?.visible
                ? (e.shift?.shortName || "")
                : "";

            return e.month === month
                ? (
                    !name
                        ? `\n${e.date}\n`
                        : `${e.date}\n--\n${name}`
                ) : "\n\n";
        });
    } // }}}

    /**
     * @param {number} m
     * @returns {string}
     */
    const getHeaderMonth = (m) => { // {{{
        return lang.ui.get("month", `${m}`);
    } // }}}

    /**
     * @returns {string[]}
     */
    const getHeaderWeekDays = () => { // {{{
        let order = [0, 1, 2, 3, 4, 5, 6];
        const weekStart = store.ui.get("week-start");

        if (weekStart > 0) {
            order = [
                ...order.slice(weekStart),
                ...order.slice(0, weekStart),
            ];
        }

        /** @type {string[]} */
        const result = [];
        for (let i = 0; i < 7; i++) {
            result.push(lang.ui.get("week-day", order[i % 7].toString()));
        }

        return result
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

        /** @type {DBDataEntry[]} */
        let mA = await calendarUtils.getArray(year, month, document.querySelector("ui-store"));

        for (let i = 0; i < mA.length; i++) {
            const dbE = await db.get(mA[i].year, mA[i].month, mA[i].date);
            if (dbE !== null) {
                mA[i].note = dbE.note;
                mA[i].shift = dbE.shift || mA[i].shift;
            }
        }

        autoTable(doc, {
            head: [
                [
                    {
                        content: getHeaderMonth(month),
                        colSpan: 7,
                        styles: {
                            fillColor: [0, 0, 0],
                            textColor: [255, 255, 255]
                        }
                    }
                ], getHeaderWeekDays(),
            ],
            body: [
                getRowFromArray(month, mA.slice(0, 7)),
                getRowFromArray(month, mA.slice(7, 14)),
                getRowFromArray(month, mA.slice(14, 21)),
                getRowFromArray(month, mA.slice(21, 28)),
                getRowFromArray(month, mA.slice(28, 35)),
                getRowFromArray(month, mA.slice(35, 42)),
            ],
            theme: "grid",
            styles: {
                valign: "middle",
                halign: "center",
                font: "Courier",
                fontStyle: "bold",
                fontSize: 12,
            },
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
            }
        });
    }

    await exportDoc(doc, year, month);
} // }}}

/**
 * @param {jspdf.jsPDF} doc
 * @param {number} year
 * @param {number} [month]
 */
async function exportDoc(doc, year, month = null) { // {{{
    let fileName = `${year}.pdf`;
    if (month !== null) {
        fileName = `${year}-${month.toString().padStart(2, "0")}.pdf`;
    }

    if (isAndroid()) {
        const result = await Filesystem.writeFile({
            path: fileName,
            // @ts-ignore
            data: doc.output("datauri"),
            //encoding: Encoding.UTF8,
            directory: Directory.Cache,
        });

        await Share.share({
            title: fileName.slice(0, fileName.length - 4),
            url: result.uri,
            dialogTitle: `Share "${fileName}"`,
        });

        return;
    }

    doc.save(fileName);
} // }}}
