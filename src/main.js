import "../node_modules/ui/css/main.css";
import "./styles.css";

import ui from "ui";
import { App } from "./app";
import { constants } from "./lib";
import { CalendarPage, SettingsPage } from "./pages";

ui.define()
    .then(() => {
        customElements.define("calendar-page", CalendarPage);
        customElements.define("settings-page", SettingsPage);
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

window.addEventListener("DOMContentLoaded", () => {
    /** @type {import("ui/src/wc").Store} */
    const store = document.querySelector("ui-store");

    store.data.set("date-picker", new Date(), true);
    store.data.set("theme", constants.theme, true);
    store.data.set("week-start", constants.weekstart, true);
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

    const app = new App(document.querySelector("#app"), store);
    app.onMount();
    app.run();
});
