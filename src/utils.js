import ui from "ui";

/**
 * @param {import("./lib/storage").StorageDataTheme} theme
 * @param {import("./app").App} app
 */
export async function setTheme(theme, app) {
    // TODO: Handle theme name `ev.detail.name`
    if (theme.mode === "system") {
        // Enable auto mode
        app.themeHandler.removeAttribute("mode");
        app.themeHandler.setAttribute("auto", "");
    } else {
        // Disable auto mode and set theme manually
        app.themeHandler.removeAttribute("auto");
        app.themeHandler.setAttribute("mode", theme.mode);
    }

    app.themeHandler.connectedCallback();
    app.storage.set("theme", theme);
}

export const isAndroid = ui.utils.isAndroid

/**
 * @param {import("./types").Shift} shift
 */
export function validateShift(shift) {
    // Check for shift data
    if (typeof shift.id !== "number") {
        return false;
    }

    if (
        typeof shift.name !== "string" ||
        typeof shift.shortName !== "string"
    ) {
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
