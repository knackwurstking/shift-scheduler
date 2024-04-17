import "../node_modules/ui/css/main.css";
import "../styles/main.css";

import ui from "ui";
import { App } from "./app";
import constants from "./lib/constants";
import { StackLayout, StackLayoutPage } from "./components";

ui.define()
    .then(() => {
        customElements.define("stack-layout", StackLayout);
        customElements.define("stack-layout-page", StackLayoutPage);
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

window.addEventListener("DOMContentLoaded", () => {
    const app = new App(document.querySelector("#app")).onMount().run(); // TODO: Run the onDestroy method?

    // Enable debugging borders
    if (constants.debug) app.getElement().classList.add("is-debug");
});
