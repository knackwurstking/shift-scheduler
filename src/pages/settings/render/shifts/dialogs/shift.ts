// TODO: Add create function here, just like the date-picker dialog

import { Shift } from "@types";

export function open(data: Shift | null): Promise<Shift | null> {
    return new Promise((resolve) => {
        const dialog = document.querySelector<HTMLDialogElement>(`dialog[name="shift"]`)!;
        const form = dialog.querySelector<HTMLFormElement>(`form`)!;

        const inputName = form.querySelector<HTMLInputElement>(`input.name`)!;
        const inputShortName = form.querySelector<HTMLInputElement>(`input.short-name`)!;
        const inputColorPicker = form.querySelector<HTMLInputElement>(`input.color-picker`)!;
        const checkboxDefaultColor = form.querySelector<HTMLInputElement>(`input.default-color`)!;
        const checkboxHidden = form.querySelector<HTMLInputElement>(`input.hidden`)!;

        form.querySelector<HTMLElement>(`button.cancel`)!.onclick = (e) => {
            e.preventDefault();
            dialog.close();
        };

        let result: Shift | null = null;

        dialog.onclose = () => resolve(result);

        form.onsubmit = (e) => {
            // Get the data, validate it, and update result
            const newData: Shift = {
                id: data?.id || new Date().getTime(),
                name: inputName.value,
                shortName: inputShortName.value,
                visible: !checkboxHidden.checked,
                color: checkboxDefaultColor.checked ? null : inputColorPicker.value || null,
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
            checkboxHidden.checked = typeof data?.visible !== "boolean" ? false : !data.visible;

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
