import * as types from "../types";

export function open(
    rhythm: types.calendar.Rhythm,
    shifts: types.calendar.Shift[],
): Promise<types.calendar.Rhythm> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLDialogElement>(`dialog[name="rhythm"]`)!;
        const form = dialog.querySelector<HTMLFormElement>(`form`)!;
        const cancelButton = form.querySelector<HTMLElement>(`button.cancel`)!;
        const tbody = form.querySelector<HTMLElement>(`tbody`)!;
        const shiftsContainer = form.querySelector<HTMLElement>(`.shifts-container`)!;

        const templateTableItem = dialog.querySelector<HTMLTemplateElement>(
            `template[name="table-item"]`,
        )!;

        const templateShiftCard = document.querySelector<HTMLTemplateElement>(
            `template[name="shift-card"]`,
        )!;

        const renderTBody = () => {
            tbody.innerHTML = "";

            // Setup Rhythm items for the table
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

                const tableItem = (templateTableItem.content.cloneNode(true) as HTMLElement)
                    .children[0] as HTMLElement;

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
                    // Re-Render the table
                    renderTBody();
                };
            });
        };

        const renderShiftsContainer = () => {
            shiftsContainer.innerHTML = "";

            // Setup Shift Card items for the shifts-container
            shifts.forEach((shift) => {
                const card = (templateShiftCard.cloneNode(true) as HTMLElement)
                    .children[0] as HTMLElement;

                shiftsContainer.appendChild(card);

                card.onclick = () => {
                    rhythm.push(shift.id);
                    renderShiftsContainer();
                };
            });
        };

        const rhythmOriginal = rhythm;
        dialog.onclose = () => resolve(rhythmOriginal);
        cancelButton.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        form.onsubmit = () => {
            resolve(rhythm);
        };

        dialog.showModal();
    });
}
