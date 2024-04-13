import "./node_modules/ui/css/main.css";
import "./styles/main.css";

import { ripple, svg, utils, component } from "ui";
import AppBar from "./lib/app-bar";
import constants from "./lib/constants";
import Language from "./lib/language";
import StackLayout from "./lib/stack-layout";
import Storage from "./lib/storage";
import CalendarPage from "./pages/calendar";

/**
 * @typedef Components
 * @type {{
 *  backButton: component.base.IconButton;
 *  datePicker: component.base.Button;
 * }}
 */

const storage = new Storage();
const language = new Language();

storage.addListener("lang", async (/** @type {StorageDataLang} */ data) => {
  if (constants.debug) console.log(`[Main] storage: "lang"`, data);
  await language.setLanguage(data || constants.language);
  storage.dispatch("week-start"); // This will trigger an update on the calendar week days
});

((/**@type{HTMLElement}*/ app, /**@type{Components}*/ c) => {
  ((/**@type{HTMLElement}*/ leftSlot) => {
    leftSlot.appendChild(c.backButton.element);
    leftSlot.appendChild(c.datePicker.element);
  })(app.querySelector("#appBarLeft"));

  ((/**@type{HTMLElement}*/ rightSlot) => {
    // TODO: Initialize all the other components missing from the index.html
    // ...
  })(app.querySelector("#appBarCenter"));

  if (constants.debug) app.classList.add("is-debug");

  // Main Function
  (async (/**@type{AppBar}*/ appBar) => {
    createThemeHandler(new utils.theme.ThemeHandler());
    await language.setLanguage(storage.get("lang", constants.language));

    setAppBarHandlers(appBar).then((appBar) => appBar.onMount());

    new StackLayout(
      document.querySelector("main.container > .stack-layout"),
      appBar,
    ).setPage(new CalendarPage({ storage, language, appBar }));
  })(new AppBar(document.querySelector(".ui-app-bar"), ""));
})(
  document.querySelector("#app"),
  // Create "ui" components
  {
    backButton: new component.button.IconButton({
      icon: svg.BackArrowNavigation,
      color: "primary",
      className: "app-bar-back-button",
    }),
    datePicker: new component.button.Button({
      text: "Date Picker",
      variant: "outline",
      color: "primary",
      className: "app-bar-date-picker",
    }),
  },
);

/*
async function createRipple() {
  const elements = document.querySelectorAll("*[data-ripple]");
  elements.forEach(async (el) => {
    ripple.create(el, JSON.parse(el.getAttribute("data-ripple") || "{}"));
  });
}
*/

async function createThemeHandler(/**@type{utils.theme.ThemeHandler}*/ th) {
  th.addTheme("zinc", "/themes/zinc.css").loadTheme(constants.theme.name);

  storage.addListener("theme", (/**@type{StorageDataTheme}*/ data) => {
    if (constants.debug) console.log(`[Main] storage: "theme"`, data);
    if (!!data?.mode) {
      th.stop().setMode(data.mode);
    } else {
      th.start();
    }
  });
  storage.dispatch("theme");

  return th;
}

/**
 * @param {AppBar} appBar
 */
async function setAppBarHandlers(appBar) {
  appBar.getElement("backButton").onclick = () => {
    // ...
  };

  appBar.getElement("datePicker").onclick = () => {
    // ...
  };

  appBar.getElement("editMode").onclick = () => {
    // Add the edit mode (footer), dont forget to apply the class ".edit-mode" to the main container
  };

  appBar.getElement("today").onclick = () => {
    appBar.datePicker.date = new Date();
  };

  appBar.getElement("pdf").onclick = () => {
    // ...
  };

  appBar.getElement("settings").onclick = () => {
    // ...
  };

  return appBar;
}
