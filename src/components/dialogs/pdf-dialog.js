import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import * as jspdf from "jspdf";
import autoTable from "jspdf-autotable";
import { CleanUp, html, isAndroid, UIDialog, UISpinner } from "ui";
import { db, utils } from "../../lib";

/**
 * HTML: `pdf-dialog`
 *
 * @extends {UIDialog<import("ui").UIDialog_Events>}
 */
export class PDFDialog extends UIDialog {
    static register = () => {
        customElements.define("pdf-dialog", PDFDialog);
    };

    constructor() {
        super("");

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");
        /** @type {import("ui").UIStackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        /** @type {import("ui").UIInput<import("ui").UIInput_Events>} */
        this.year;

        this.downloadAction;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-flex-grid gap="0.5rem">
                <ui-flex-grid-item>
                    <ui-input
                        name="picker"
                        type="number"
                        value="${new Date(
                            this.uiStore.ui.get("date-picker"),
                        ).getFullYear()}"
                    ></ui-input>
                </ui-flex-grid-item>
            </ui-flex-grid>
        `;

        this.year = this.querySelector(`ui-input[name="picker"]`);

        this.year.ui.events.on("input", (value) => {
            const n = parseInt(value);
            if (isNaN(n) || n < 1900) {
                this.year.ui.invalid = true;
                this.downloadAction.action.ui.disabled = true;
            } else {
                this.year.ui.invalid = false;
                this.downloadAction.action.ui.disabled = false;
            }
        });

        this.downloadAction = UIDialog.createAction({
            variant: "full",
            color: "primary",
            onClick: async () => {
                const spinner = new UISpinner();
                document.body.appendChild(spinner);

                setTimeout(async () => {
                    try {
                        const date = new Date(parseInt(this.year.ui.value), 0);
                        await createPDF({
                            year: date.getFullYear(),
                            lang: this.uiLang,
                            store: this.uiStore,
                        });
                    } finally {
                        document.body.removeChild(spinner);
                    }
                });

                this.ui.close();
            },
        });
        this.appendChild(this.downloadAction.container);
    }

    connectedCallback() {
        super.connectedCallback();

        this.stackLayout.ui.lock = true;

        this.cleanup.add(
            this.uiStore.ui.on(
                "lang",
                () => {
                    this.ui.title = this.uiLang.ui.get("pdf-dialog", "title");

                    this.year.ui.title = this.uiLang.ui.get(
                        "pdf-dialog",
                        "input-title-year",
                    );

                    this.downloadAction.action.innerText = this.uiLang.ui.get(
                        "pdf-dialog",
                        "button-download",
                    );
                },
                true,
            ),
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stackLayout.ui.lock = false;
        this.cleanup.run();
    }
}

/**
 * @param {Object} options
 * @param {number | null} [options.year]
 * @param {number | null} [options.month]
 * @param {import("ui").UILang} options.lang
 * @param {SchedulerStore} options.store
 */
async function createPDF({
    year = null,
    month = null, // NOTE: Not used for now
    lang = null,
    store = null,
}) {
    // Check params for year and month
    const today = new Date();

    if (month === null && year === null) {
        month = today.getMonth();
    }

    if (year === null) {
        year = today.getFullYear();
    }

    // Create the PDF
    const doc = new jspdf.jsPDF();
    doc.setFont("Courier");

    // Add pages
    const months =
        month !== null ? [month] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    let pageIndex = 0;
    for (const m of months) {
        if (pageIndex === 2) {
            doc.addPage();
            pageIndex = 1;
        } else {
            pageIndex++;
        }

        /** @type {DB_Entry[]} */
        let mA = await utils.calendar.getArray(year, m, store);

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
                        content: lang.ui.get("month", `${m}`),
                        colSpan: 7,
                        styles: {
                            fillColor: [0, 0, 0],
                            textColor: [255, 255, 255],
                        },
                    },
                ],
                getTableHeader(store, lang),
            ],
            body: [
                getTableBodyEntries(m, mA.slice(0, 7)),
                getTableBodyEntries(m, mA.slice(7, 14)),
                getTableBodyEntries(m, mA.slice(14, 21)),
                getTableBodyEntries(m, mA.slice(21, 28)),
                getTableBodyEntries(m, mA.slice(28, 35)),
                getTableBodyEntries(m, mA.slice(35, 42)),
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
            },
        });
    }

    await exportDoc(doc, year, month);
}

/**
 * @param {SchedulerStore} store
 * @param {import("ui").UILang} lang
 * @returns {string[]}
 */
function getTableHeader(store, lang) {
    let order = [0, 1, 2, 3, 4, 5, 6];
    const weekStart = store.ui.get("week-start");

    if (weekStart > 0) {
        order = [...order.slice(weekStart), ...order.slice(0, weekStart)];
    }

    /** @type {string[]} */
    const result = [];
    for (let i = 0; i < 7; i++) {
        result.push(lang.ui.get("week-day", order[i % 7].toString()));
    }

    return result;
}

/**
 * @param {number} month
 * @param {DB_Entry[]} entries
 * @returns {string[]}
 */
function getTableBodyEntries(month, entries) {
    return entries.slice(0, 7).map((entry) => {
        const name = entry.shift?.visible ? entry.shift?.shortName || "" : "";

        if (entry.month === month) {
            if (!name) {
                return `\n${entry.date}\n`;
            }

            return `${entry.date}\n--\n${name}`;
        }

        return "\n\n";
    });
}

/**
 * @param {jspdf.jsPDF} doc
 * @param {number} year
 * @param {number} [month]
 */
async function exportDoc(doc, year, month = null) {
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
}
