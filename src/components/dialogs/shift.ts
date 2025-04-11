import { html } from "@lib";
import { m } from "@paraglide/messages";
import { Shift } from "@types";

function create(): CreateDialog {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.innerHTML = html`
        <form method="dialog">
            <div class="ui-flex-grid">
                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        ${m.input_shift_name()}
                        <input
                            class="name"
                            type="text"
                            style="margin-left: var(--ui-spacing); max-width: 20ch"
                        />
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        ${m.input_shift_short_name()}
                        <input
                            class="short-name"
                            type="text"
                            maxlength="4"
                            style="margin-left: var(--ui-spacing); max-width: 6ch"
                        />
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%;">
                    <label class="ui-flex column justify-between ui-padding">
                        ${m.dialog_shift_label_time()}

                        <div
                            class="ui-flex-grid-row"
                            style="--justify: space-between;"
                        >
                            <input class="time-from" type="time" />
                            <p><i class="bi bi-arrow-right"></i></p>
                            <input class="time-to" type="time" />
                        </div>
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        ${m.pick_color()}
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
                        ${m.disable_color()}
                        <input class="default-color" type="checkbox" />
                    </label>
                </div>

                <div class="ui-flex-grid-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        ${m.hide_shift()}
                        <input class="hidden" type="checkbox" />
                    </label>
                </div>

                <div
                    class="ui-flex-grid-row"
                    style="--justify: flex-end; width: 100%"
                >
                    <button class="cancel" color="secondary">
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

export function open(data: Shift | null): Promise<Shift | null> {
    return new Promise((resolve) => {
        const { dialog, destroy } = create();

        const inputName = dialog.querySelector<HTMLInputElement>(`input.name`)!;

        const inputShortName =
            dialog.querySelector<HTMLInputElement>(`input.short-name`)!;

        const inputTimeFrom =
            dialog.querySelector<HTMLInputElement>(`input.time-from`)!;

        const inputTimeTo =
            dialog.querySelector<HTMLInputElement>(`input.time-to`)!;

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

        const form = dialog.querySelector(`form`)!;

        form.onkeydown = async (e) => {
            if (e.key === "Enter") {
                form.dispatchEvent(new Event("submit"));
            }
        };

        form.onsubmit = (e) => {
            // Get the data, validate it, and update result
            const newData: Shift = {
                id: data?.id || new Date().getTime(),
                name: inputName.value,
                shortName: inputShortName.value,
                visible: !checkboxHidden.checked,
                color: checkboxDefaultColor.checked
                    ? null
                    : inputColorPicker.value || null,

                times: {
                    from: inputTimeFrom.value || "",
                    to: inputTimeTo.value || "",
                },
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

        // Initialize the form with shift data
        inputName.value = data?.name || "";
        inputShortName.value = data?.shortName || "";
        inputTimeFrom.value = data?.times?.from || "";
        inputTimeTo.value = data?.times?.to || "";
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

        dialog.showModal();
    });
}
