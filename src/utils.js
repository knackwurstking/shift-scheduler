import { constants } from "./lib";

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
