import "../node_modules/ui/css/main.css";
import "./styles.css";

import ui from "ui";
import { App } from "./app";
import { CalendarPage, SettingsPage } from "./pages";
import { constants } from "./lib";

ui.define()
    .then(() => {
        customElements.define("calendar-page", CalendarPage);
        customElements.define("settings-page", SettingsPage);
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

window.addEventListener("DOMContentLoaded", () => {
    /** @type {import("ui/src/wc").Store} */
    const store = document.querySelector("ui-store");

    store.set("theme", constants.theme, true);
    store.set("lang", constants.language, true);
    store.set("week-start", constants.weekstart, true);
    store.set("settings", constants.settings, true);
    store.set("debug-mode", constants.debug, true);

    new App(document.querySelector("#app"), store).onMount().run();
});
