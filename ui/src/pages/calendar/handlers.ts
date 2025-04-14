import { store, constants, EditMode, Shifts } from "@lib";
import { shiftCard } from "@components";
import { m } from "@paraglide/messages";

import { updateItemContent } from "./item-content";
import { Direction } from "./swipe-handler";

export async function datePicker(dateString: number): Promise<void> {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() - 1);

    Array.from(document.querySelector(`.item-container`)!.children).forEach(
        // Update item-container > item
        async (item) => {
            updateItemContent(
                item.querySelector(`.item-content`)!,
                date.getFullYear(),
                date.getMonth(),
            );

            date.setMonth(date.getMonth() + 1);
        },
    );
}

export async function editMode(data: EditMode): Promise<void> {
    const routerTarget = document.querySelector("#routerTarget")!;

    const itemContainer =
        routerTarget.querySelector<HTMLElement>(".item-container");
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
    const shifts: Shifts = [
        {
            id: 0,
            name: m.reset(),
            shortName: "",
            visible: false,
        },
        ...(store.obj.get("shifts") || []),
    ];

    shifts.forEach((shift) => {
        const card = shiftCard.create();

        card.methods.active(active === shift.id);
        card.methods.queryName().innerText = shift.name;

        const shortName = card.methods.queryShortName();
        shortName.style.color = shift.color || "inherit";
        shortName.innerText = shift.visible ? shift.shortName : "";

        card.element.onclick = () => {
            card.methods.active(!card.methods.isActive());

            store.obj.update("editMode", (data) => {
                data.active = card.methods.isActive()
                    ? shift.id
                    : constants.shiftIDNothing;
                return data;
            });
        };

        container.appendChild(card.element);
    });
}
