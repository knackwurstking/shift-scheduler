import { html, store } from "@lib";
import { CreateDialog, DBEntry } from "@types";
import { m } from "@paraglide/messages";

function create(): CreateDialog {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.innerHTML = html`
        <form method="dialog">
            <h4 class="title"></h4>

            <select class="shift-select" style="width: 100%">
                <option value="0">${m.reset()}</option>
            </select>

            <div>
                <label>${m.note()}</label>
                <textarea
                    class="db-note"
                    rows="6"
                    style="resize: none; width: 100%"
                ></textarea>
            </div>

            <div class="ui-flex gap justify-end">
                <button class="cancel" color="secondary">${m.cancel()}</button>
                <input type="submit" value="${m.submit()}" />
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

export function open(
    date: Date,
    shiftID: number,
    data: DBEntry | null,
): Promise<{ shiftID: number; note: string } | null> {
    return new Promise((resolve) => {
        const { dialog, destroy } = create();

        const shiftSelect = dialog.querySelector<HTMLSelectElement>(
            "select.shift-select",
        )!;
        const dbNote =
            dialog.querySelector<HTMLTextAreaElement>("textarea.db-note")!;

        // Close section
        dialog.querySelector<HTMLButtonElement>(`button.cancel`)!.onclick = (
            e,
        ) => {
            e.preventDefault();
            dialog.close();
        };

        let result: { shiftID: number; note: string } | null = null;

        dialog.onclose = () => {
            resolve(result);
            setTimeout(destroy);
        };

        const form = dialog.querySelector(`form`)!;

        form.onkeydown = async (e) => {
            if (e.key === "Enter") {
                form.dispatchEvent(new Event("submit"));
            }
        };

        form.onsubmit = () => {
            result = {
                shiftID: parseInt(shiftSelect.value || "0", 10),
                note: dbNote.value.trim(),
            };
        };

        // Content section
        {
            // Setup title
            dialog.querySelector<HTMLElement>(".title")!.innerText =
                date.toDateString();

            // Setup shift select
            while (shiftSelect.children.length > 1) {
                shiftSelect.removeChild(shiftSelect.lastChild!);
            }
            store.obj.get("shifts")!.forEach((shift) => {
                const option = document.createElement("option");
                option.value = shift.id.toString();
                option.innerText = shift.name || shift.shortName;
                shiftSelect.appendChild(option);

                if (shift.id === shiftID) {
                    option.selected = true;
                }
            });

            // Setup note textarea
            dbNote.value = data?.note || "";
        }

        dialog.showModal();
    });
}
