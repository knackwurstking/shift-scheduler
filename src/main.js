import "../node_modules/ui/css/main.css";
import "./styles.css";

import ui from "ui";
import { App } from "./app";
import constants from "./lib/constants";
import { StackLayout, StackLayoutPage } from "./components";
import { CalendarPage } from "./pages";

ui.define()
    .then(() => {
        customElements.define("stack-layout", StackLayout);
        customElements.define("stack-layout-page", StackLayoutPage);
        customElements.define("calendar-page", CalendarPage);
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

window.addEventListener("DOMContentLoaded", () => {
    const app = new App(document.querySelector("#app")).onMount().run(); // TODO: Run the onDestroy method?

    // Enable debugging borders
    if (constants.debug) app.element.classList.add("is-debug");
});
