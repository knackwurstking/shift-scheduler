import * as types from "../types";

export function open(rhythm: types.settings.Rhythm): Promise<types.settings.Rhythm> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLDialogElement>(`dialog[name="rhythm"]`)!;
        const form = dialog.querySelector<HTMLFormElement>(`form`)!;
        const tbody = form.querySelector<HTMLElement>(`tbody`)!;
        const shiftsContainer = form.querySelector<HTMLElement>(`.shifts-container`)!;

        const templateTableItem = dialog.querySelector<HTMLTemplateElement>(
            `template[name="table-item"]`,
        );

        const templateShiftCard = dialog.querySelector<HTMLTemplateElement>(
            `template[name="shift-card"]`,
        );

        const result: types.settings.Rhythm | null = null;
        dialog.onclose = () => resolve(result || rhythm);

        form.onsubmit = () => {
            // TODO: ...
        };

        // TODO: Setup Rhythm items for the table

        // TODO: Setup Shift Card items for the shifts-container

        dialog.showModal();
    });
}
