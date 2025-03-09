import { store } from "../../globals";
import * as types from "../../types";

import * as components from "./components";
import { Direction } from "./lib/swipe-handler";

export async function datePicker(dateString: number): Promise<void> {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() - 1);

    Array.from(document.querySelector(`.item-container`)!.children).forEach(
        // Update item-container > item
        async (item) => {
            components.itemContent.update(
                item.querySelector(`.item-content`)!,
                date.getFullYear(),
                date.getMonth(),
            );

            date.setMonth(date.getMonth() + 1);
        },
    );
}

export async function editMode(data: types.calendar.EditMode): Promise<void> {
    const routerTarget = document.querySelector("#routerTarget")!;

    const itemContainer = routerTarget.querySelector<HTMLElement>(".item-container");
    const editModeContainer = document.querySelector<HTMLElement>(".edit-mode");

    if (!itemContainer || !editModeContainer) return;

    editModeContainer.innerHTML = "";

    if (data.open) {
        // Open the ".edit-mode" bottom bar
        itemContainer.setAttribute("edit-mode", "");
        editModeContainer.setAttribute("open", "");
        renderShiftCards(editModeContainer, data.active);
    } else {
        // Close it again
        itemContainer.removeAttribute("edit-mode");
        editModeContainer.removeAttribute("open");
    }
}

export async function swipe(direction: Direction): Promise<void> {
    switch (direction) {
        case "left":
            // Go to next month
            store.obj.update("datePicker", (dateString) => {
                const date = new Date(dateString);
                date.setMonth(date.getMonth() + 1);
                return date.getTime();
            });

            break;

        case "right":
            // Go to prev month
            store.obj.update("datePicker", (dateString) => {
                const date = new Date(dateString);
                date.setMonth(date.getMonth() - 1);
                return date.getTime();
            });

            break;
    }
}

function renderShiftCards(container: HTMLElement, active: number): void {
    const template: HTMLTemplateElement = document.querySelector(`template[name="shift-card"]`)!;

    (store.obj.get("shifts") || []).forEach((shift) => {
        const card: HTMLElement = (template.content.cloneNode(true) as HTMLElement).querySelector(
            ".shift-card",
        )!;

        if (active === shift.id) {
            card.setAttribute("active", "");
            card.scrollIntoView();
        } else {
            card.removeAttribute("active");
        }

        card.querySelector<HTMLElement>(`.name`)!.innerText = shift.name;

        const shortName = card.querySelector<HTMLElement>(`.short-name`)!;
        shortName.style.color = shift.color || "inherit";
        shortName.innerText = shift.visible ? shift.shortName : "";

        card.onclick = () => {
            if (card.hasAttribute("active")) {
                card.removeAttribute("active");
            } else {
                card.setAttribute("active", "");
            }

            store.obj.update("editMode", (data) => {
                data.active = card.hasAttribute("active") ? shift.id : 0;
                return data;
            });
        };

        container.appendChild(card);
    });
}
