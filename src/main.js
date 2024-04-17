import "../node_modules/ui/css/";
import "../node_modules/ui/css/themes/zinc";
import "./styles/main.css";

import constants from "./lib/constants";
import { App } from "./app";

window.addEventListener("DOMContentLoaded", () => {
    const app = new App(document.querySelector("#app")).onMount().run(); // TODO: Run the onDestroy method?

    // Enable debugging borders
    if (constants.debug) app.getElement().classList.add("is-debug");
});
