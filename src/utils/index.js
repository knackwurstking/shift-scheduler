/**
 * @typedef {import("ui/src/ui-theme-handler").UIThemeHandler} UIThemeHandler
 *
 * @typedef {import("../types").ThemeStore} ThemeStore
 * @typedef {import("../types").Shift} Shift
 */

/**
 * @param {ThemeStore} theme
 * @param {UIThemeHandler} themeHandler
 */
export async function setTheme(theme, themeHandler) { // {{{
    //try {
    //    themeHandler.ui.loadTheme(theme.name)
    //} catch {
    //    themeHandler.ui.loadTheme("zinc") // default theme (original)
    //}

    if (theme.mode === "system") {
        // Enable auto mode
        themeHandler.ui.enableAutoMode()
    } else {
        // Disable auto mode and set theme manually
        themeHandler.ui.setMode(theme.mode)
        themeHandler.ui.disableAutoMode()
    }
} // }}}

/**
 * @param {Shift} shift
 */
export function validateShift(shift) { // {{{
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

    if (shift.color === "transparent") {
        shift.visible = false;
        shift.color = null;
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
 * @param {string | null} title
 */
export async function setAppBarTitle(title) { // {{{
    const child = document.createElement("span");
    child.innerHTML = `${title || ""}`;
    document.querySelector("shift-scheduler-app").appendChild(child);
} // }}}
