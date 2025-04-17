import { html } from "@lib";
import { CreateDialog } from "@types";
import { m } from "@paraglide/messages";

function create(): CreateDialog {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.innerHTML = html`
        <form method="dialog">
            <label>
                ${m.pick_a_date()}
                <input type="month" style="width: fit-content" />
            </label>

            <div class="ui-flex gap justify-end">
                <button class="cancel" data-ui-color="secondary">
                    ${m.cancel()}
                </button>
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
    date: string | number | Date,
): Promise<{ date: number } | null> {
    return new Promise((resolve) => {
        const { dialog, destroy } = create();

        const monthInput =
            dialog.querySelector<HTMLInputElement>(`input[type="month"]`)!;

        dialog.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: { date: number } | null = null;

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
                date: new Date(monthInput.value).getTime(),
            };
        };

        {
            switch (typeof date) {
                case "string":
                    date = new Date(date);
                    break;

                case "number":
                    date = new Date(date);
                    break;
            }

            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            monthInput.value = `${date.getFullYear()}-${month}`;
        }

        dialog.showModal();
    });
}
