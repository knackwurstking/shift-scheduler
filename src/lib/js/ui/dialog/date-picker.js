/**
 * 
 * @param {number} year 
 * @param {number} month 
 * @param {{
 *  onsubmit: (ev: CustomEvent<{ year: number, month: number }>) => (void|Promise<void>);
 *  oncancel: (ev: CustomEvent<void>) => (void|Promise<void>);
 * }} props 
 */
export async function create(year, month, props) {
    const dialog = document.createElement("dialog");

    dialog.classList.add("date-picker--dialog");
    dialog.open = true;
    // TODO: add children ...
}