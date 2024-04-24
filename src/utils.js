import ui from "ui";

/**
 * @param {import("./types").ThemeStore} theme
 * @param {import("ui/src/wc").ThemeHandler} themeHandler
 */
export async function setTheme(theme, themeHandler) {
    // TODO: Handle theme name `theme.name`
    if (theme.mode === "system") {
        // Enable auto mode
        themeHandler.removeAttribute("mode");
        themeHandler.setAttribute("auto", "");
    } else {
        // Disable auto mode and set theme manually
        themeHandler.removeAttribute("auto");
        themeHandler.setAttribute("mode", theme.mode);
    }

    themeHandler.connectedCallback();
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
