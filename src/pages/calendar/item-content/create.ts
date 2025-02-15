import * as store from "../../../store";
import * as types from "../../../types";
import * as utils from "../../../utils";
import * as constants from "./constants";

const html = String.raw;

export function create(): DocumentFragment {
    const fragment = document
        .querySelector<HTMLTemplateElement>(constants.query.templateCalendarItem)!
        .content.cloneNode(true) as DocumentFragment;

    const itemContent = fragment.querySelector(constants.query.itemContent)!;

    for (let y = 0; y < 6; y++) {
        const row = document.createElement("div");
        itemContent.appendChild(row);

        row.className = "days ui-flex-grid-item ui-flex-grid-row";
        row.style.setProperty("--gap", "0.05rem");

        for (let x = 0; x < 7; x++) {
            row.append(createDayItem(0)); // TODO: Placeholder "0"
        }
    }

    return fragment;
}

export async function update(itemContent: HTMLElement, date: Date): Promise<void> {
    const settings = store.obj.get("settings")!;
    const days: HTMLElement[] = Array.from(itemContent.querySelectorAll(constants.query.day));

    let dataEntries: types.db.Entry[] = await utils.calendar.getDataForDays(
        days.length,
        date.getFullYear(),
        date.getMonth(),
    );

    dataEntries.forEach(async (entry, index) => {
        // TODO: db missing
        const data = await db.get(entry.year, entry.month, entry.date);
        if (data !== null) {
            entry.note = data.note;

            const shift = settings.shifts.find((shift) => shift.id === data.shift?.id);
            if (!!shift) {
                entry.shift = shift;
            } else {
                entry.shift = data.shift || entry.shift;
            }
        }

        updateDayItem(days[index], entry);

        // Inactive Item
        if (entry.year !== date.getFullYear() || entry.month !== date.getMonth()) {
            days[index].classList.add("inactive");
        } else {
            days[index].classList.remove("inactive");
        }
    });

    markWeekendItems(...days);

    date.setMonth(date.getMonth() + 1);
}

export function markWeekendItems(...days: Element[]): void {
    const order = [0, 1, 2, 3, 4, 5, 6];
    const satIndex = order.findIndex((o) => o === 6);
    const sunIndex = order.findIndex((o) => o === 0);

    days.forEach((c, i) => {
        c.classList.remove("is-saturday");
        c.classList.remove("is-sunday");

        if (i % order.length === satIndex) {
            c.classList.add("is-saturday");
        }

        if (i % order.length === sunIndex) {
            c.classList.add("is-sunday");
        }
    });
}

function createDayItem(date: number, shift?: string): HTMLDivElement {
    const el = document.createElement("div");

    el.className = "day ui-flex-grid-item";

    el.innerHTML = html`
        <div class="date">${date}</div>
        <div class="shift">${shift || ""}</div>
    `;

    return el;
}

function updateDayItem(dayItem: HTMLElement, entry: types.db.Entry): void {
    const isToday = (year: number, month: number, date: number): boolean => {
        const today = new Date();

        return (
            today.getFullYear() === year && today.getMonth() === month && today.getDate() === date
        );
    };

    // Today Item
    if (isToday(entry.year, entry.month, entry.date)) {
        dayItem.classList.add("today");
    } else {
        dayItem.classList.remove("today");
    }

    // Has Note
    if (!!entry.note) {
        dayItem.classList.add("note");
    } else {
        dayItem.classList.remove("note");
    }

    // Set date and shift
    dayItem.querySelector(constants.query.date)!.innerHTML = `${entry.date}`;

    const shiftItem = dayItem.querySelector<HTMLElement>(constants.query.shift)!;

    if (!entry.shift) {
        shiftItem.style.removeProperty("--shift-color");
        shiftItem.innerHTML = "";
    } else {
        shiftItem.style.setProperty(
            "--shift-color",
            entry.shift.visible ? entry.shift.color || "inherit" : "transparent",
        );

        shiftItem.innerHTML = entry.shift.shortName || "";
    }

    // Needed for the dialog to add a note or modify the shift
    dayItem.setAttribute("data-year", entry.year.toString());
    dayItem.setAttribute("data-month", entry.month.toString());
    dayItem.setAttribute("data-date", entry.date.toString());
}
