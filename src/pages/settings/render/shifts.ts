import { dialogs } from "@components";
import { html, store } from "@lib";
import { m } from "@paraglide/messages";

const articleHTML = html`
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

        <template name="table-item">
            <tr class="item">
                <td class="name" style="text-align: left;"></td>

                <td
                    class="short-name"
                    style="text-align: left; color: inherit"
                ></td>

                <td class="actions" style="text-align: right;">
                    <div class="ui-flex-grid-row" style="--justify: flex-end;">
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
            </tr>
        </template>
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

export function article(): HTMLElement {
    const article = document.createElement("article");
    article.className = "shifts";
    article.innerHTML = articleHTML;

    const renderShiftsTableSection = () => {
        // Table Section
        const tbody = article.querySelector<HTMLElement>(`tbody`)!;
        const template = article.querySelector<HTMLTemplateElement>(
            `template[name="table-item"]`,
        )!;

        // Reset
        tbody.innerHTML = "";

        // Create shift table rows from settings shifts
        // TODO: Enable drag'n'drop for table items
        store.obj.get("shifts")!.forEach((shift) => {
            const tableItem = (
                template.content.cloneNode(true) as HTMLElement
            ).querySelector<HTMLElement>(`tr.item`)!;

            tbody.appendChild(tableItem);

            // Set shift name
            tableItem.querySelector<HTMLElement>(`.name`)!.innerText =
                shift.name;

            // Set shifts short name
            const shortName =
                tableItem.querySelector<HTMLElement>(`.short-name`)!;
            shortName.style.color = shift.color || "inherit";
            shortName.innerText = shift.visible ? shift.shortName : "";

            // Set edit button handler, open edit dialog
            const editButton =
                tableItem.querySelector<HTMLElement>(`button.edit`)!;
            editButton.onclick = async () => {
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

                renderShiftsTableSection();
            };

            tableItem.querySelector<HTMLElement>(`button.delete`)!.onclick =
                async () => {
                    if (confirm(`Delete shift \"${shift.name}\"?`)) {
                        store.obj.update("shifts", (shifts) => {
                            return shifts.filter((s) => s.id !== shift.id);
                        });
                    }

                    renderShiftsTableSection();
                };
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
        startDateInput.onchange = () => {
            store.obj.set(
                "startDate",
                new Date(startDateInput.value).getTime(),
            );
        };
    }

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
