import { html } from "@lib";
import { DialogCreate, Shift } from "@types";

function create(): DialogCreate {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.innerHTML = html`
        <form method="dialog">
            <div class="ui-flex-grid">
                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        Name (ex.: Night)
                        <input
                            class="name"
                            type="text"
                            style="margin-left: var(--ui-spacing)"
                        />
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        Short (ex.: N)
                        <input
                            class="short-name"
                            type="text"
                            style="margin-left: var(--ui-spacing)"
                        />
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        Pick a color
                        <input
                            class="color-picker"
                            style="min-width: 4rem"
                            type="color"
                        />
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        Disable color
                        <input class="default-color" type="checkbox" />
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        Hide shift
                        <input class="hidden" type="checkbox" />
                    </label>
                </div>

                <div
                    class="ui-flex-grid-row"
                    style="--justify: flex-end; width: 100%"
                >
                    <button class="cancel" color="secondary">Cancel</button>
                    <input type="submit" />
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

export function open(data: Shift | null): Promise<Shift | null> {
    return new Promise((resolve) => {
        const { dialog, destroy } = create();

        const inputName = dialog.querySelector<HTMLInputElement>(`input.name`)!;
        const inputShortName =
            dialog.querySelector<HTMLInputElement>(`input.short-name`)!;
        const inputColorPicker =
            dialog.querySelector<HTMLInputElement>(`input.color-picker`)!;
        const checkboxDefaultColor =
            dialog.querySelector<HTMLInputElement>(`input.default-color`)!;
        const checkboxHidden =
            dialog.querySelector<HTMLInputElement>(`input.hidden`)!;

        dialog.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: Shift | null = null;

        dialog.onclose = () => {
            resolve(result);
            setTimeout(destroy);
        };

        dialog.querySelector(`form`)!.onsubmit = (e) => {
            // Get the data, validate it, and update result
            const newData: Shift = {
                id: data?.id || new Date().getTime(),
                name: inputName.value,
                shortName: inputShortName.value,
                visible: !checkboxHidden.checked,
                color: checkboxDefaultColor.checked
                    ? null
                    : inputColorPicker.value || null,
            };

            if (!newData.name) {
                e.preventDefault();
                inputName.ariaInvalid = "";
                return;
            }
            inputName.ariaInvalid = null;

            if (!newData.shortName) {
                e.preventDefault();
                inputShortName.ariaInvalid = "";
                return;
            }
            inputShortName.ariaInvalid = null;

            result = newData;
        };

        {
            // Initialize the form with shift data
            inputName.value = data?.name || "";
            inputShortName.value = data?.shortName || "";
            inputColorPicker.value = data?.color || "#66FF00";
            checkboxDefaultColor.checked = !data?.color;
            checkboxHidden.checked =
                typeof data?.visible !== "boolean" ? false : !data.visible;

            // Initialize input handler for disabling or enabling stuff
            // Default Color:
            checkboxDefaultColor.onchange = () => {
                inputColorPicker.disabled = checkboxDefaultColor.checked;
                inputShortName.style.color = checkboxDefaultColor.checked
                    ? "inherit"
                    : inputColorPicker.value || "inherit";
            };

            // Hidden:
            checkboxHidden.onchange = (e) => {
                inputShortName.disabled = checkboxHidden.checked;
                inputColorPicker.disabled = checkboxHidden.checked;
                checkboxDefaultColor.disabled = checkboxHidden.checked;

                checkboxDefaultColor.onchange!(e);
            };

            checkboxDefaultColor.onchange!(new Event("change"));
            checkboxHidden.onchange!(new Event("change"));
        }

        dialog.showModal();
    });
}
