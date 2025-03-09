import * as types from "@types";

export function open(
    rhythm: types.calendar.Rhythm,
    shifts: types.calendar.Shift[],
): Promise<types.calendar.Rhythm> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLDialogElement>(`dialog[name="rhythm"]`)!;
        const form = dialog.querySelector<HTMLFormElement>(`form`)!;
        const tbody = form.querySelector<HTMLElement>(`tbody`)!;
        const shiftsContainer = form.querySelector<HTMLElement>(`.shifts-container`)!;

        const templateTableItem = dialog.querySelector<HTMLTemplateElement>(
            `template[name="table-item"]`,
        )!;

        const templateShiftCard = document.querySelector<HTMLTemplateElement>(
            `template[name="shift-card"]`,
        )!;

        form.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: types.calendar.Rhythm = [...rhythm];

        dialog.onclose = () => resolve(result);

        form.onsubmit = () => {
            result = rhythm;
        };

        {
            const renderTBody = () => {
                tbody.innerHTML = "";

                // Setup Rhythm items for the table
                rhythm.forEach((id, index) => {
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
                    ).querySelector<HTMLElement>(`.table-item`)!;

                    // Setup table item
                    tableItem.querySelector<HTMLElement>(".name")!.innerText = shift.name;

                    const shortName = tableItem.querySelector<HTMLElement>(".short-name")!;
                    shortName.style.color = shift.color || "inherit";
                    shortName.innerText = !!shift.visible ? shift.shortName : "";

                    // Delete button handler
                    const deleteButton =
                        tableItem.querySelector<HTMLButtonElement>(`button.delete`)!;
                    deleteButton.onclick = () => {
                        // Delete this item from the rhythm
                        rhythm.splice(index, 1);
                        // Re-Render the table
                        renderTBody();
                    };

                    tbody.appendChild(tableItem);
                    tableItem.scrollIntoView();
                });
            };

            const renderShiftsContainer = () => {
                shiftsContainer.innerHTML = "";

                // Setup Shift Card items for the shifts-container
                shifts.forEach((shift) => {
                    const card = (
                        templateShiftCard.content.cloneNode(true) as HTMLElement
                    ).querySelector<HTMLElement>(`.shift-card`)!;

                    shiftsContainer.appendChild(card);

                    const name = card.querySelector<HTMLElement>(".name")!;
                    name.innerText = shift.name;

                    const shortName = card.querySelector<HTMLElement>(".short-name")!;
                    shortName.style.color = shift.color || "inherit";
                    shortName.innerText = shift.visible ? shift.shortName : "";

                    card.onclick = () => {
                        rhythm.push(shift.id);
                        renderTBody();
                    };
                });
            };

            renderTBody();
            renderShiftsContainer();
        }

        dialog.showModal();
    });
}
