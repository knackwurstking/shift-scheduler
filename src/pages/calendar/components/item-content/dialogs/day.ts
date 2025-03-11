// TODO: Add create function here, just like the date-picker dialog
import * as globals from "@globals";
import { DBEntry } from "@types";

export function open(
    date: Date,
    shiftID: number,
    data: DBEntry | null,
): Promise<{ shiftID: number; note: string } | null> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLFormElement>(`dialog[name="day"]`)!;
        const form = dialog.querySelector<HTMLFormElement>("form")!;

        const shiftSelect = form.querySelector<HTMLSelectElement>("select.shift-select")!;
        const dbNote = form.querySelector<HTMLTextAreaElement>("textarea.db-note")!;

        // Close section
        form.querySelector<HTMLButtonElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: { shiftID: number; note: string } | null = null;

        dialog.onclose = () => {
            resolve(result);
        };

        form.onsubmit = () => {
            result = {
                shiftID: parseInt(shiftSelect.value || "0", 10),
                note: dbNote.value.trim(),
            };
        };

        // Content section
        {
            // Setup title
            form.querySelector<HTMLElement>(".title")!.innerText = date.toDateString();

            // Setup shift select
            while (shiftSelect.children.length > 1) {
                shiftSelect.removeChild(shiftSelect.lastChild!);
            }
            globals.store.obj.get("shifts")!.forEach((shift) => {
                const option = document.createElement("option");
                option.value = shift.id.toString();
                option.innerText = shift.name || shift.shortName;
                shiftSelect.appendChild(option);

                if (shift.id === shiftID) {
                    option.selected = true;
                }
            });

            // Setup note textarea
            dbNote.value = data?.note || "";
        }

        dialog.showModal();
    });
}
