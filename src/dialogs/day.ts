export function open(): Promise<null> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLFormElement>(`dialog[name="day"]`)!;
        const form = dialog.querySelector<HTMLFormElement>("form")!;

        form.querySelector<HTMLButtonElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        const result: null = null;

        dialog.onclose = () => {
            resolve(result);
        };

        form.onsubmit = () => {
            // ...
        };

        {
            // TODO: ...
        }

        dialog.showModal();
    });
}
