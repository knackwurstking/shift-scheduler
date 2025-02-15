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

export function createDayItem(date: number, shift?: string): HTMLDivElement {
    const el = document.createElement("div");

    el.className = "day ui-flex-grid-item";

    el.innerHTML = html`
        <div class="date">${date}</div>
        <div class="shift">${shift || ""}</div>
    `;

    return el;
}
