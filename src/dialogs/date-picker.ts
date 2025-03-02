export function open(date: string | number | Date): Promise<{ date: number } | null> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLDialogElement>(`dialog[name="date-picker"]`)!;
        const form = dialog.querySelector<HTMLFormElement>(`form`)!;
        const cancelButton = form.querySelector<HTMLElement>(`button.cancel`)!;
        const monthInput = form.querySelector<HTMLInputElement>(`input[type="month"]`)!;

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
        form.onsubmit = () => {
            result = {
                date: new Date(monthInput.value).getTime(),
            };
        };

        dialog.onclose = () => resolve(result);
        cancelButton.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };
        dialog.showModal();
    });
}
