import ui from "ui";

/**
 * @typedef {import("ui/src/wc").ThemeHandler} ThemeHandler
 *
 * @typedef {import("./types").ThemeStore} ThemeStore
 * @typedef {import("./types").Shift} Shift
 */

/**
 * @param {ThemeStore} theme
 * @param {ThemeHandler} themeHandler
 */
async function setTheme(theme, themeHandler) { // {{{
    try {
        themeHandler.ui.loadTheme(theme.name)
    } catch {
        themeHandler.ui.loadTheme("zinc") // default theme (original)
    }

    if (theme.mode === "system") {
        // Enable auto mode
        themeHandler.ui.enableAutoMode()
    } else {
        // Disable auto mode and set theme manually
        themeHandler.ui.setMode(theme.mode)
        themeHandler.ui.disableAutoMode()
    }
} // }}}

const isAndroid = ui.js.utils.isAndroid;

/**
 * @param {Shift} shift
 */
function validateShift(shift) { // {{{
    // Check for shift data
    if (typeof shift.id !== "number") {
        return false;
    }

    if (typeof shift.name !== "string" || typeof shift.shortName !== "string") {
        return false;
    }

    if (typeof shift.color !== "string" && !!shift.color) {
        return false;
    }

    if (typeof shift.visible !== "boolean") {
        shift.visible = true;
    }

    if (!shift.color) {
        shift.color = null;
    }

    return true;
} // }}}

/**
 * @param {string} title
 */
async function setAppBarTitle(title) { // {{{
    document.querySelector("#appBarTitle").innerHTML = `<h3>${title}</h3>`;
} // }}}

export default {
    setTheme,
    isAndroid,
    validateShift,
    setAppBarTitle,
}
