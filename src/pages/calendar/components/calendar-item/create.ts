import * as constants from "./constants";

const html = String.raw;

export function create(): DocumentFragment {
    const item = document
        .querySelector<HTMLTemplateElement>(constants.query.templateCalendarItem)!
        .content.cloneNode(true) as DocumentFragment;

    const itemContent = item.querySelector(constants.query.itemContent)!;

    for (let y = 0; y < 6; y++) {
        const row = document.createElement("div");
        itemContent.appendChild(row);

        row.classList.add("days ui-flex-grid-row");
        row.style.setProperty("--gap", "0.05rem");

        for (let x = 0; x < 7; x++) {
            row.append(createDayItem());
        }
    }

    return item;
}

export function createDayItem(): HTMLDivElement {
    const el = document.createElement("div");

    el.className = "day ui-flex-grid-item";

    el.innerHTML = html`
        <div class="date"></div>
        <div class="shift"></div>
    `;

    return el;
}
