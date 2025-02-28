import * as types from "../types";

export function open(
    rhythm: types.settings.Rhythm,
    shifts: types.calendar.Shift[],
): Promise<types.settings.Rhythm> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLDialogElement>(`dialog[name="rhythm"]`)!;
        const form = dialog.querySelector<HTMLFormElement>(`form`)!;
        const tbody = form.querySelector<HTMLElement>(`tbody`)!;
        const shiftsContainer = form.querySelector<HTMLElement>(`.shifts-container`)!;

        const templateTableItem = dialog.querySelector<HTMLTemplateElement>(
            `template[name="table-item"]`,
        )!;

        const templateShiftCard = dialog.querySelector<HTMLTemplateElement>(
            `template[name="shift-card"]`,
        )!;

        // Reset
        tbody.innerHTML = "";
        shiftsContainer.innerHTML = "";

        const result: types.settings.Rhythm | null = null;
        dialog.onclose = () => resolve(result || rhythm);

        form.onsubmit = () => {
            // TODO: ...
        };

        // TODO: Setup Rhythm items for the table
        // iter rhythm, get shift from shifts (check for id), ...
        rhythm.forEach((id) => {
            let shift = shifts.find((shift) => shift.id === id);
            if (!shift) {
                shift = {
                    id: id,
                    name: "",
                    shortName: "",
                    color: "var(--destructive)",
                    visible: false,
                };
            }

            const tableItem = (
                templateTableItem.content.cloneNode(true) as HTMLElement
            ).querySelector<HTMLElement>(`tr`)!;

            tbody.appendChild(tableItem);

            // Setup table item
            tableItem.querySelector<HTMLElement>(".name")!.innerText = shift.name;

            const shortName = tableItem.querySelector<HTMLElement>(".short-name")!;
            shortName.style.color = shift.color || "inherit";
            shortName.innerText = !!shift.visible ? shift.shortName : "";

            // Delete button handler
            const deleteButton = tableItem.querySelector<HTMLButtonElement>(`button.delete`)!;
            deleteButton.onclick = () => {
                // Delete this item from the rhythm
                rhythm = rhythm.filter((id) => id !== shift.id);
                // TODO: Re-Render the table
            };
        });

        // TODO: Setup Shift Card items for the shifts-container

        dialog.showModal();
    });
}
