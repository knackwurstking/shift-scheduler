import "../node_modules/ui/css/main.css";
import "./styles.css";

import ui from "ui";
import { App } from "./app";
import constants from "./lib/constants";
import { CalendarPage, SettingsPage } from "./pages";

ui.define()
    .then(() => {
        customElements.define("calendar-page", CalendarPage);
        customElements.define("settings-page", SettingsPage);
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

window.addEventListener("DOMContentLoaded", () => {
    const app = new App(document.querySelector("#app")).onMount().run(); // TODO: Run the onDestroy method?

    // Enable debugging borders
    if (constants.debug) app.element.classList.add("is-debug");
});
