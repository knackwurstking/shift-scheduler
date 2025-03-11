import { html } from "@utils";
import { DialogCreate } from "@types";

export function create(): DialogCreate {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.innerHTML = html`
        <form method="dialog">
            <label>
                Pick a Date
                <input type="month" style="min-width: 12ch" />
            </label>

            <div class="ui-flex-grid-row" style="--justify: flex-end">
                <button class="cancel" color="secondary">Cancel</button>
                <input type="submit" />
            </div>
        </form>
    `;

    return {
        dialog,
        destroy() {
            document.body.removeChild(this.dialog);
        },
    };
}

export function open(date: string | number | Date): Promise<{ date: number } | null> {
    return new Promise((resolve) => {
        const { dialog, destroy } = create();

        const form = dialog.querySelector<HTMLFormElement>(`form`)!;
        const monthInput = form.querySelector<HTMLInputElement>(`input[type="month"]`)!;

        form.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: { date: number } | null = null;

        dialog.onclose = () => {
            resolve(result);
            setTimeout(destroy);
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
