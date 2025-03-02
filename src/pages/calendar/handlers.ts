import * as store from "../../lib/store";
import * as types from "../../types";

import * as itemContent from "./item-content/";
import { Direction } from "./lib/swipe-handler";

export async function datePicker(dateString: number): Promise<void> {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() - 1);

    Array.from(document.querySelector(`.item-container`)!.children).forEach(
        // Update item-container > item
        async (item) => {
            itemContent.update(
                item.querySelector(`.item-content`)!,
                date.getFullYear(),
                date.getMonth(),
            );

            date.setMonth(date.getMonth() + 1);
        },
    );
}

export async function editMode(_data: types.calendar.EditMode): Promise<void> {
    // TODO: ...
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
