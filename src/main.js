import "../node_modules/ui/css/main.css";
import "./styles.css";

import ui from "ui";
import { App } from "./app";
import { constants } from "./lib";
import { CalendarPage, SettingsPage } from "./pages";
import { StartDate } from "./pages/settings/start-date";

ui.define()
    .then(() => {
        customElements.define("calendar-page", CalendarPage);
        customElements.define("settings-page", SettingsPage);
        customElements.define("settings-start-date", StartDate);
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

window.addEventListener("DOMContentLoaded", () => {
    /** @type {import("ui/src/wc").Store} */
    const store = document.querySelector("ui-store");

    store.data.set("date-picker", (new Date()).toString(), true);
    store.data.set("theme", constants.theme, true);
    store.data.set("week-start", constants.weekStart, true);
    store.data.set("settings", constants.settings, true);
    store.data.set("debug", constants.debug, true);

    /** @type {import("ui/src/wc").Lang} */
    const lang = document.querySelector("ui-lang")

    // TODO: Auto language detection handler here...
    // ...

    lang.data.on("change", (lt) => {
        if (!lt) {
            console.log("[main] No language set for now!")
            return
        }

        console.log(`[main] current language in use:`, lt)
        store.data.set("lang", lt.name, true);
    }, true)

    store.data.on("debug", (/**@type{import("./types").DebugStore}*/state) => {
        if (state) {
            document.querySelector("#app").classList.add("is-debug")
        } else {
            document.querySelector("#app").classList.remove("is-debug")
        }
    }, true)


    /** @type {import("ui/src/wc").ThemeHandler} */
    const th = document.querySelector("#themeHandler")
    th.addTheme("zinc", `/public/themes/zinc.css`);
    th.addTheme("green", `/public/themes/green.css`);

    const app = new App(store);
    app.onMount();
    app.run();
});
