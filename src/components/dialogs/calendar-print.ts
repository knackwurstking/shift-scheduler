import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import * as jspdf from "jspdf";
import autoTable from "jspdf-autotable";

import { calendarUtils, constants, db, html, store } from "@lib";
import { m } from "@paraglide/messages";
import { DBEntry } from "@types";

function create(year: number): CreateDialog {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.innerHTML = html`
        <form method="dialog">
            <label class="ui-flex justify-between align-center">
                ${m.pick_a_year()}
                <input
                    class="year"
                    style="width: 8ch"
                    type="number"
                    min="0"
                    step="0"
                    value="${year}"
                />
            </label>

            <div class="ui-flex-grid-row" style="--justify: flex-end">
                <button class="cancel" color="secondary">${m.cancel()}</button>
                <input type="submit" value="${m.submit()}" />
            </div>
        </form>
    `;

    return {
        dialog,
        destroy() {
            document.body.removeChild(dialog);
        },
    };
}

export function open(year: number): Promise<void> {
    return new Promise((resolve) => {
        const { dialog, destroy } = create(year);

        dialog.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        dialog.onclose = () => {
            resolve();
            setTimeout(destroy);
        };

        const form = dialog.querySelector(`form`)!;

        form.onkeydown = async (e) => {
            console.warn("onkeydown:", e.key);
            if (e.key === "Enter") {
                form.dispatchEvent(new Event("submit"));
            }
        };

        form.onsubmit = async () => {
            console.warn("onsubmit:");
            year = parseInt(
                dialog.querySelector<HTMLInputElement>(`input.year`)!.value ||
                    new Date().getFullYear().toString(),
                10,
            );

            await createPDF({ year: year, month: null });
        };

        dialog.showModal();
    });
}

async function createPDF(options: {
    year: number | null;
    month: number | null;
}) {
    // Check params for year and month
    const today = new Date();

    if (options.month === null && options.year === null) {
        options.month = today.getMonth();
    }

    if (options.year === null) {
        options.year = today.getFullYear();
    }

    // Create the PDF
    const doc = new jspdf.jsPDF();
    doc.setFont("Courier");

    // Add pages
    const months =
        options.month !== null
            ? [options.month]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    let pageIndex = 0;
    for (const month of months) {
        if (pageIndex === 2) {
            doc.addPage();
            pageIndex = 1;
        } else {
            pageIndex++;
        }

        let monthDataArray: DBEntry[] = await calendarUtils.getDataForDays(
            42,
            options.year,
            month,
        );

        for (let i = 0; i < monthDataArray.length; i++) {
            const dbEntry = await db.get(
                monthDataArray[i].year,
                monthDataArray[i].month,
                monthDataArray[i].date,
            );

            if (dbEntry !== null) {
                monthDataArray[i].note = dbEntry.note;
                monthDataArray[i].shift =
                    dbEntry.shift || monthDataArray[i].shift;
            }
        }

        autoTable(doc, {
            head: [
                [
                    {
                        content: constants.months[month](),
                        colSpan: 7,
                        styles: {
                            fillColor: [0, 0, 0],
                            textColor: [255, 255, 255],
                        },
                    },
                ],
                getTableHeader(),
            ],
            body: [
                getTableBodyEntries(month, monthDataArray.slice(0, 7)),
                getTableBodyEntries(month, monthDataArray.slice(7, 14)),
                getTableBodyEntries(month, monthDataArray.slice(14, 21)),
                getTableBodyEntries(month, monthDataArray.slice(21, 28)),
                getTableBodyEntries(month, monthDataArray.slice(28, 35)),
                getTableBodyEntries(month, monthDataArray.slice(35, 42)),
            ],
            theme: "grid",
            styles: {
                valign: "middle",
                halign: "center",
                font: "Courier",
                fontStyle: "normal",
                fontSize: 12,
            },
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
            },
        });
    }

    await exportDoc(doc, options.year, options.month);
}

function getTableHeader(): string[] {
    let order = constants.defaultWeekOrder;
    const weekStart = store.obj.get("weekStart")!;

    if (weekStart > 0) {
        order = [...order.slice(weekStart), ...order.slice(0, weekStart)];
    }

    const result: string[] = [];
    for (let i = 0; i < 7; i++) {
        result.push(
            constants.defaultWeekDaysInOrder[order[i % 7]]().toString(),
        );
    }

    return result;
}

function getTableBodyEntries(month: number, entries: DBEntry[]): string[] {
    return entries.slice(0, 7).map((entry) => {
        const name = entry.shift?.visible ? entry.shift?.shortName || "" : "";

        if (entry.month === month) {
            return `${entry.date}\n--\n${name || ""}`;
        }

        return "\n\n";
    });
}

async function exportDoc(
    doc: jspdf.jsPDF,
    year: number,
    month: number | null = null,
) {
    let fileName = `${year}.pdf`;
    if (month !== null) {
        fileName = `${year}-${month.toString().padStart(2, "0")}.pdf`;
    }

    if (process.env.MODE === "capacitor") {
        await Share.share({
            title: fileName.slice(0, fileName.length - 4),
            dialogTitle: m.share_file({ name: fileName }),
            url: (
                await Filesystem.writeFile({
                    path: fileName,
                    // @ts-ignore
                    data: doc.output("datauri"),
                    directory: Directory.Cache,
                })
            ).uri,
        });
    } else {
        doc.save(fileName);
    }
}
