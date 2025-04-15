import { draggable } from "ui";

import { shiftCard } from "@components";
import { html } from "@lib";
import { CreateDialog, Rhythm, Shift } from "@types";
import { m } from "@paraglide/messages";

function create(): CreateDialog {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.setAttribute("fullscreen", "");

    dialog.innerHTML = html`
        <form method="dialog" style="width: 100%; height: 100%">
            <div
                class="ui-flex column gap"
                style="width: 100%; height: 100%; margin: 0"
            >
                <div
                    class="ui-flex-item ui-auto-scroll-y ui-hide-scrollbar"
                    style="width: 100%"
                >
                    <table>
                        <thead>
                            <tr>
                                <th class="left">${m.name()}</th>
                                <th class="left">${m.short()}</th>
                                <th class="left"></th>
                            </tr>
                        </thead>

                        <tbody></tbody>
                    </table>
                </div>

                <div
                    class="ui-flex-item"
                    style="position: relative; max-height: 1.6rem; width: 100%"
                >
                    <hr
                        style="position: absolute; top: var(--ui-spacing); left: 0; width: 100%"
                    />
                </div>

                <div
                    class="picker ui-flex-item"
                    style="flex: 0; position: relative; max-height: fit-content; width: 100%"
                >
                    <div
                        class="shifts-container ui-flex gap ui-auto-scroll-x ui-hide-scrollbar"
                        style="width: 100%; height: 100%"
                    ></div>
                </div>

                <div class="ui-flex gap justify-end">
                    <button class="cancel" data-ui-color="secondary">
                        ${m.cancel()}
                    </button>
                    <input type="submit" value="${m.submit()}" />
                </div>
            </div>
        </form>
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

        dialog.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: Rhythm = [...rhythm];

        dialog.onclose = () => resolve(result);

        const form = dialog.querySelector(`form`)!;

        form.onkeydown = async (e) => {
            if (e.key === "Enter") {
                form.dispatchEvent(new Event("submit"));
            }
        };

        form.onsubmit = () => {
            result = rhythm;
            setTimeout(destroy);
        };

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

                const tableItem = createTableItem(shift, {
                    onDelete: async () => {
                        // Delete this item from the rhythm
                        rhythm.splice(index, 1);

                        // Re-Render
                        renderTBody();
                    },
                });

                tbody.appendChild(tableItem);
                tableItem.scrollIntoView();
            });

            // Enable drag'n'drop for table items
            draggable.createMobile(tbody, {
                onDragEnd: () => {
                    rhythm = Array.from(tbody.children).map((child) => {
                        return JSON.parse(child.getAttribute("data-json")!);
                    });

                    // Re-Render
                    renderTBody();
                },
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

        dialog.showModal();
    });
}

function createTableItem(
    shift: Shift,
    options: { onDelete: () => Promise<void> | void },
): HTMLTableRowElement {
    const tr = document.createElement("tr");

    tr.style.userSelect = "none";

    tr.setAttribute("data-json", JSON.stringify(shift.id));

    tr.innerHTML = html`
        <td class="name left"></td>

        <td class="short-name left" style="color: inherit"></td>

        <td class="right">
            <div class="ui-flex gap justify-end">
                <div class="ui-flex-item" style="flex: 0">
                    <button
                        class="delete"
                        data-ui-variant="ghost"
                        data-ui-color="destructive"
                        data-ui-icon
                    >
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </td>
    `;

    // Setup table item
    tr.querySelector<HTMLElement>(".name")!.innerText = shift.name;

    const shortName = tr.querySelector<HTMLElement>(".short-name")!;

    shortName.style.color = shift.color || "inherit";
    shortName.innerText = !!shift.visible ? shift.shortName : "";

    // Delete Button
    tr.querySelector<HTMLButtonElement>(`button.delete`)!.onclick =
        options.onDelete;

    return tr;
}
