import { shiftCard } from "@components";
import { html } from "@lib";
import { DialogCreate, Rhythm, Shift } from "@types";

function create(): DialogCreate {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.setAttribute("fullscreen", "");

    dialog.innerHTML = html`
        <form method="dialog" style="width: 100%; height: 100%">
            <div
                class="ui-flex-grid"
                style="width: 100%; height: 100%; margin: 0"
            >
                <div
                    class="ui-flex-grid-item ui-auto-scroll-y ui-hide-scrollbar"
                    style="width: 100%"
                >
                    <table>
                        <thead>
                            <tr>
                                <th class="left">Name</th>
                                <th class="left">Short</th>
                                <th class="left"></th>
                            </tr>
                        </thead>

                        <tbody></tbody>
                    </table>
                </div>

                <div
                    class="ui-flex-grid-item"
                    style="position: relative; max-height: 1.6rem; width: 100%"
                >
                    <hr
                        style="position: absolute; top: var(--ui-spacing); left: 0; width: 100%"
                    />
                </div>

                <div
                    class="picker ui-flex-grid-item"
                    style="--flex: 0; position: relative; max-height: fit-content; width: 100%"
                >
                    <div
                        class="shifts-container ui-flex-grid-row ui-auto-scroll-x ui-hide-scrollbar"
                        style="width: 100%; height: 100%"
                    ></div>
                </div>

                <div class="ui-flex-grid-row" style="--justify: flex-end">
                    <button class="cancel" color="secondary">Cancel</button>
                    <input type="submit" />
                </div>
            </div>
        </form>

        <template name="table-item">
            <tr class="table-item">
                <td class="name left"></td>

                <td class="short-name left" style="color: inherit"></td>

                <td class="right">
                    <div class="ui-flex-grid-row" style="--justify: flex-end">
                        <div class="ui-flex-grid-item" style="--flex: 0">
                            <button
                                class="delete"
                                variant="ghost"
                                color="destructive"
                                icon
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </template>
    `;

    return {
        dialog,
        destroy() {
            document.body.removeChild(dialog);
        },
    };
}

export function open(rhythm: Rhythm, shifts: Shift[]): Promise<Rhythm> {
    return new Promise((resolve) => {
        const { dialog, destroy } = create();
        const tbody = dialog.querySelector<HTMLElement>(`tbody`)!;
        const shiftsContainer =
            dialog.querySelector<HTMLElement>(`.shifts-container`)!;

        const templateTableItem = dialog.querySelector<HTMLTemplateElement>(
            `template[name="table-item"]`,
        )!;

        dialog.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: Rhythm = [...rhythm];

        dialog.onclose = () => resolve(result);

        dialog.querySelector(`form`)!.onsubmit = () => {
            result = rhythm;
            setTimeout(destroy);
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
                    tableItem.querySelector<HTMLElement>(".name")!.innerText =
                        shift.name;

                    const shortName =
                        tableItem.querySelector<HTMLElement>(".short-name")!;
                    shortName.style.color = shift.color || "inherit";
                    shortName.innerText = !!shift.visible
                        ? shift.shortName
                        : "";

                    // Delete button handler
                    const deleteButton =
                        tableItem.querySelector<HTMLButtonElement>(
                            `button.delete`,
                        )!;
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
                    const card = shiftCard.create();
                    shiftsContainer.appendChild(card.element);

                    card.methods.queryName().innerText = shift.name;

                    const shortName = card.methods.queryShortName();
                    shortName.style.color = shift.color || "inherit";
                    shortName.innerText = shift.visible ? shift.shortName : "";

                    card.element.onclick = () => {
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
