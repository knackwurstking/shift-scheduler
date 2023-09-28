import * as utils from "../../utils";

/**
 * @typedef DatePickerDialogProps
 * @type {{
 *  onsubmit: (ev: CustomEvent<{ year: number, month: number }>) => (void|Promise<void>);
 *  oncancel: (ev: CustomEvent<void>) => (void|Promise<void>);
 * }}
 */

/**
 * 
 * @param {number} year 
 * @param {number} month 
 * @param {DatePickerDialogProps} props 
 * @returns {HTMLDialogElement}
 */
export async function create(year, month, props) {
    const dialog = document.createElement("dialog");

    dialog.classList.add("date-picker--dialog");
    dialog.open = false;

    if (props?.oncancel) {
        dialog.addEventListener("cancel", props.oncancel);
    }
    if (props?.onsubmit) {
        dialog.addEventListener("submit", props.onsubmit);
    }

    // TODO: add children ...
    if (utils.isAndroid()) {
        dialog.innerHTML = `
            <article>
            </article>
        `;
    } else {
        dialog.innerHTML = `
            <article>
            </article>
        `;
    }

    return dialog;
}

/**
 * 
 * @param {HTMLDialogElement} dialog
 * @param {number} year 
 * @param {number} month 
 */
export async function update(dialog, year, month) {
    // TODO: update input year and month
    if (utils.isAndroid()) {
        // ...
    } else {
        // ...
    }
}