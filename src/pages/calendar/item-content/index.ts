import db from "../../../lib/db";
import * as store from "../../../lib/store";
import * as utils from "../../../lib/utils";
import * as types from "../../../types";

const html = String.raw;
export const defaultWeekOrder = [0, 1, 2, 3, 4, 5, 6];
export const defaultWeekDaysInOrder = ["Sun", "Mon", "Tue", "Wed", "Thy", "Fri", "Sat"];

export function create(year: number, month: number): DocumentFragment {
    const fragment = document
        .querySelector<HTMLTemplateElement>(`template[name="calendar-item-content"]`)!
        .content.cloneNode(true) as DocumentFragment;

    const itemContent = fragment.querySelector<HTMLElement>(`.item-content`)!;

    for (let y = 0; y < 6; y++) {
        const row = document.createElement("div");
        itemContent.appendChild(row);

        row.className = "days ui-flex-grid-item ui-flex-grid-row";
        row.style.setProperty("--gap", "0.05rem");

        for (let x = 0; x < 7; x++) {
            row.append(createDayItem(0)); // NOTE: Placeholder "0"
        }
    }

    setTimeout(() => {
        update(itemContent, year, month);
    });

    return fragment;
}

export async function update(itemContent: HTMLElement, year: number, month: number): Promise<void> {
    const date = new Date(year, month);
    const settings = store.obj.get("settings")!;
    const days: HTMLElement[] = Array.from(
        itemContent.querySelectorAll(`.item-content > .days > .day`),
    );

    let dataEntries: types.db.Entry[] = await utils.calendar.getDataForDays(
        days.length,
        date.getFullYear(),
        date.getMonth(),
    );

    dataEntries.forEach(async (entry, index) => {
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

        // Set [disabled]
        if (month !== entry.month) {
            days[index].setAttribute("disabled", "");
        } else {
            days[index].removeAttribute("disabled");
        }

        // Inactive Item
        if (entry.year !== date.getFullYear() || entry.month !== date.getMonth()) {
            days[index].classList.add("inactive");
        } else {
            days[index].classList.remove("inactive");
        }
    });

    markWeekendItems(
        [...itemContent.querySelectorAll(`.item-content > .week-days > .week-day`)],
        days,
    );
}

function markWeekendItems(weekDays: Element[], days: Element[]): void {
    const weekStart = store.obj.get("week-start")!;
    let order = defaultWeekOrder;

    if (weekStart > 0) {
        order = [...order.slice(weekStart), ...order.slice(0, weekStart)];
    }

    const satIndex = order.findIndex((o) => o === 6);
    const sunIndex = order.findIndex((o) => o === 0);

    weekDays.forEach((weekDay, i) => {
        weekDay.innerHTML = `${defaultWeekDaysInOrder[order[i % 7]]}`;
    });

    [...weekDays, ...days].forEach((c, i) => {
        c.classList.remove("saturday");
        c.classList.remove("sunday");

        if (i % order.length === satIndex) {
            c.classList.add("saturday");
        }

        if (i % order.length === sunIndex) {
            c.classList.add("sunday");
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
    dayItem.querySelector(`.date`)!.innerHTML = `${entry.date}`;

    const shiftItem = dayItem.querySelector<HTMLElement>(`.shift`)!;

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
