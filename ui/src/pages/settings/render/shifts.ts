import { dialogs } from "@components";
import { html, store } from "@lib";
import { m } from "@paraglide/messages";
import { Shift } from "@types";
import { draggable } from "ui";

export function create(): HTMLElement {
    const article = document.createElement("article");

    article.className = "shifts";

    article.innerHTML = html`
        <h4>${m.shift_settings()}</h4>

        <section class="shifts-table ui-flex-grid">
            <table class="ui-flex-grid-item">
                <thead>
                    <tr>
                        <th style="text-align: left;">${m.name()}</th>
                        <th style="text-align: left;">${m.short()}</th>
                        <th style="text-align: right;"></th>
                    </tr>
                </thead>

                <tbody></tbody>
            </table>

            <div
                class="ui-flex-grid-item ui-flex justify-end"
                style="padding: var(--ui-spacing); width: 100%;"
            >
                <button class="add-shift">${m.add_shift()}</button>
            </div>
        </section>

        <section class="start-date">
            <label
                class="ui-flex justify-between align-center"
                style="padding: var(--ui-spacing);"
            >
                ${m.start_date()}
                <input type="date" />
            </label>
        </section>

        <section class="edit-rhythm">
            <label
                class="ui-flex justify-between align-center"
                style="padding: var(--ui-spacing)"
            >
                ${m.rhythm()}
                <button>${m.edit()}</button>
            </label>
        </section>
    `;

    const renderShiftsTableSection = () => {
        const tbody = article.querySelector<HTMLElement>(`tbody`)!;

        // Reset
        tbody.innerHTML = "";

        // Create shift table rows from settings shifts
        store.obj.get("shifts")!.forEach((shift) => {
            const tableItem = createTableItem(shift, {
                onEdit: async () => {
                    const data = await dialogs.shift.open(shift);
                    if (!data) {
                        return;
                    }

                    // Update store and and table item
                    store.obj.update("shifts", (shifts) => {
                        return shifts.map((shift) => {
                            if (shift.id === data.id) {
                                return data;
                            }

                            return shift;
                        });
                    });

                    // Re-Render
                    renderShiftsTableSection();
                },

                onDelete: async () => {
                    if (confirm(`Delete shift \"${shift.name}\"?`)) {
                        store.obj.update("shifts", (shifts) => {
                            return shifts.filter((s) => s.id !== shift.id);
                        });
                    }

                    // Re-Render
                    renderShiftsTableSection();
                },
            });

            tbody.appendChild(tableItem);
        });

        // Enable drag'n'drop for table items
        draggable.createMobile(tbody, {
            onDragEnd: () => {
                store.obj.set(
                    "shifts",
                    Array.from(tbody.children).map((child) => {
                        return JSON.parse(child.getAttribute("data-json")!);
                    }),
                );

                // Re-Render
                renderShiftsTableSection();
            },
        });

        // Add "Add Shift" button handler
        article.querySelector<HTMLButtonElement>(`button.add-shift`)!.onclick =
            async () => {
                const data = await dialogs.shift.open(null);
                if (!data) {
                    return;
                }

                // Update store and and table item
                store.obj.update("shifts", (shifts) => {
                    shifts.push(data);
                    return shifts;
                });

                // Re-Render
                renderShiftsTableSection();
            };
    };

    renderShiftsTableSection();

    const startDateInput = article.querySelector<HTMLInputElement>(
        `section.start-date input[type="date"]`,
    )!;

    const startDate = store.obj.get("startDate")!;
    if (!!startDate) {
        const date = new Date();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        startDateInput.value = `${date.getFullYear()}-${month}-${day}`;
    }

    startDateInput.onchange = () => {
        store.obj.set("startDate", new Date(startDateInput.value).getTime());
    };

    const editRhythmButton = article.querySelector<HTMLButtonElement>(
        `section.edit-rhythm button`,
    )!;

    editRhythmButton.onclick = async () => {
        store.obj.set(
            "rhythm",
            await dialogs.rhythm.open(
                store.obj.get("rhythm")!,
                store.obj.get("shifts")!,
            ),
        );
    };

    return article;
}

function createTableItem(
    shift: Shift,
    options: {
        onEdit: () => Promise<void> | void;
        onDelete: () => Promise<void> | void;
    },
): HTMLTableRowElement {
    const tr = document.createElement("tr");

    tr.style.userSelect = "none";

    tr.setAttribute("data-json", JSON.stringify(shift));

    tr.innerHTML = html`
        <td class="name" style="text-align: left;"></td>

        <td class="short-name" style="text-align: left; color: inherit"></td>

        <td class="actions" style="text-align: right;">
            <div
                class="ui-flex-grid-row"
                style="--justify: flex-end; --align: center;"
            >
                <div class="ui-flex-grid-item" style="--flex: 0;">
                    <button class="edit" variant="ghost" icon>
                        <i class="bi bi-pen"></i>
                    </button>
                </div>

                <div class="ui-flex-grid-item" style="--flex: 0;">
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
    `;

    // Shift Name
    tr.querySelector<HTMLElement>(`.name`)!.innerText = shift.name;

    // Short Name
    const shortName = tr.querySelector<HTMLElement>(`.short-name`)!;

    shortName.style.color = shift.color || "inherit";
    shortName.innerText = shift.visible ? shift.shortName : "";

    tr.querySelector<HTMLElement>(`button.edit`)!.onclick = options.onEdit;
    tr.querySelector<HTMLElement>(`button.delete`)!.onclick = options.onDelete;

    return tr;
}
