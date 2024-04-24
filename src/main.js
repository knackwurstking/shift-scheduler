import "../node_modules/ui/css/main.css";
import "./styles.css";

import ui from "ui";
import { App } from "./app";
import { Language, constants } from "./lib";
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
    store.data.set("lang", constants.language, true);
    store.data.set("week-start", constants.weekstart, true);
    store.data.set("settings", constants.settings, true);
    store.data.set("debug", constants.debug, true);

    const lang = new Language(store); // TODO: Create some custom component
    lang.setLanguage(store.data.get("lang"));

    const app = new App(document.querySelector("#app"), store, lang);
    app.onMount();
    app.run();
});
