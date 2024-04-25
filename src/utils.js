import ui from "ui";

/**
 * @param {import("./types").ThemeStore} theme
 * @param {import("ui/src/wc").ThemeHandler} themeHandler
 */
export async function setTheme(theme, themeHandler) {
    try {
        themeHandler.loadTheme(theme.name)
    } catch {
        themeHandler.loadTheme("zinc") // default theme (original)
    }

    if (theme.mode === "system") {
        // Enable auto mode
        themeHandler.auto = true
    } else {
        // Disable auto mode and set theme manually
        themeHandler.mode = theme.mode
        themeHandler.auto = false
    }
}

export const isAndroid = ui.utils.isAndroid;

/**
 * @param {import("./types").Shift} shift
 */
export function validateShift(shift) {
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
}

/**
 * @param {string} title
 */
export async function setAppBarTitle(title) {
    document.querySelector("#appBarTitle").innerHTML = `<h3>${title}</h3>`;
}
