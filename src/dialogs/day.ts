import * as store from "../lib/store";
import * as types from "../types";

export function open(rhythmShiftID: number, data: types.db.Entry | null): Promise<boolean> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLFormElement>(`dialog[name="day"]`)!;
        const form = dialog.querySelector<HTMLFormElement>("form")!;

        form.querySelector<HTMLButtonElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: boolean = false;

        dialog.onclose = () => {
            resolve(result);
        };

        form.onsubmit = () => {
            result = true;
        };

        {
            const shiftSelect = form.querySelector<HTMLSelectElement>("select.shift-select")!;
            const dbNote = form.querySelector<HTMLTextAreaElement>("ui-textarea.db-note")!;

            // TODO: Get current shift for rhythmShiftID
            // TODO: Get data from database and initialize dialog elements
        }

        dialog.showModal();
    });
}
