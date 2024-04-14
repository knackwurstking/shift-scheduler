import "./node_modules/ui/css/main.css";
import "./styles/main.css";

import constants from "./lib/constants";
import App from "./app";

window.addEventListener("DOMContentLoaded", () => {
  const app = new App(document.querySelector("#app")).onMount().run();

  // Enable debugging borders
  if (constants.debug) app.getElement().classList.add("is-debug");
});
