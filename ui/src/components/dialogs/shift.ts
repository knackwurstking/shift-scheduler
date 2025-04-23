import { html } from "@lib";
import { CreateDialog, Shift } from "@types";
import { m } from "@paraglide/messages";

function create(): CreateDialog {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    dialog.innerHTML = html`
        <form method="dialog">
            <div class="ui-flex column gap">
                <div class="ui-flex-item" style="width: 100%">
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

                <div class="ui-flex-item" style="width: 100%">
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

                <div class="ui-flex-item" style="width: 100%;">
                    <label class="ui-flex column justify-between ui-padding">
                        ${m.dialog_shift_time()}

                        <div class="ui-flex gap justify-between">
                            <input class="time-from" type="time" />
                            <p><i class="bi bi-arrow-right"></i></p>
                            <input class="time-to" type="time" />
                        </div>
                    </label>
                </div>

                <div class="ui-flex-item" style="width: 100%">
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

                <div class="ui-flex-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        ${m.dialog_shift_color_switch()}
                        <input class="color-switch" type="checkbox" />
                    </label>
                </div>

                <div class="ui-flex-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        ${m.disable_color()}
                        <input class="default-color" type="checkbox" />
                    </label>
                </div>

                <div class="ui-flex-item" style="width: 100%">
                    <label
                        class="ui-flex justify-between align-center ui-padding"
                    >
                        ${m.hide_shift()}
                        <input class="hidden" type="checkbox" />
                    </label>
                </div>

                <div class="ui-flex gap justify-end" style="width: 100%">
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

        const checkboxColorSwitch =
            dialog.querySelector<HTMLInputElement>(`input.color-switch`)!;

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
                colorSwitch: checkboxColorSwitch.checked,

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
        checkboxColorSwitch.checked = !!data?.colorSwitch;
        checkboxDefaultColor.checked = !data?.color;
        checkboxHidden.checked =
            typeof data?.visible !== "boolean" ? false : !data.visible;

        // Initialize input handler for disabling or enabling stuff
        // Color Switch:
        checkboxColorSwitch.onchange = () => {
            if (checkboxColorSwitch.checked && !checkboxDefaultColor.checked) {
                inputShortName.style.backgroundColor =
                    inputColorPicker.value || "transparent";
                inputShortName.style.color = inputColorPicker.value
                    ? "black"
                    : "var(--ui-text)";
            } else {
                inputShortName.style.backgroundColor = "";
                inputShortName.style.color = checkboxDefaultColor.checked
                    ? "var(--ui-text)"
                    : inputColorPicker.value || "var(--ui-text)";
            }
        };

        // Color Picker: (triggers color switch)
        inputColorPicker.oninput = (ev) => {
            checkboxColorSwitch.onchange!(ev);
        };

        // Default Color: (triggers color switch)
        checkboxDefaultColor.onchange = (ev) => {
            inputColorPicker.disabled = checkboxDefaultColor.checked;
            inputShortName.style.color = checkboxDefaultColor.checked
                ? "var(--ui-text)"
                : inputColorPicker.value || "var(--ui-text)";
            checkboxColorSwitch.onchange!(ev);
        };

        // Hidden: (triggers default color)
        checkboxHidden.onchange = (e) => {
            inputShortName.disabled = checkboxHidden.checked;
            inputColorPicker.disabled = checkboxHidden.checked;
            checkboxColorSwitch.disabled = checkboxHidden.checked;
            checkboxDefaultColor.disabled = checkboxHidden.checked;

            checkboxDefaultColor.onchange!(e);
        };

        checkboxColorSwitch.onchange!(new Event("change"));
        checkboxDefaultColor.onchange!(new Event("change"));
        checkboxHidden.onchange!(new Event("change"));

        dialog.showModal();
    });
}
