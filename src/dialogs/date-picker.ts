import * as constants from "./constants";

export function open(date: string | number | Date): Promise<{ date: number } | null> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLDialogElement>(
            constants.query.datePicker.dialog,
        )!;

        const monthInput = document.querySelector<HTMLInputElement>(
            constants.query.datePicker.inputs.month,
        )!;

        switch (typeof date) {
            case "string":
                date = new Date(date);
                break;

            case "number":
                date = new Date(date);
                break;
        }

        monthInput.value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

        let result: { date: number } | null = null;
        const form = document.querySelector<HTMLFormElement>(constants.query.datePicker.form)!;
        form.onsubmit = () => {
            result = {
                date: new Date(monthInput.value).getTime(),
            };
        };

        dialog.onclose = () => resolve(result);
        dialog.showModal();
    });
}
