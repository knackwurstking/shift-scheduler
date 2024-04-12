import "./node_modules/ui/css/main.css";
import "./styles/main.css";

import { ripple, svg, utils, component } from "ui";
import AppBar from "./lib/app-bar";
import constants from "./lib/constants";
import Language from "./lib/language";
import StackLayout from "./lib/stack-layout";
import Storage from "./lib/storage";
import CalendarPage from "./pages/calendar";

const storage = new Storage();
const language = new Language();

storage.addListener("lang", async (/** @type {StorageDataLang} */ data) => {
  if (constants.debug) console.log(`[Main] storage: "lang"`, data);
  if (!data) {
    data = constants.language;
  }

  await language.setLanguage(data);
  storage.dispatch("week-start"); // This will trigger an update on the calendar week days
});

const c = {
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
};

((app) => {
  ((leftSlot) => {
    leftSlot.appendChild(c.backButton.element);
    leftSlot.appendChild(c.datePicker.element);
  })(app.querySelector("#appBarLeft"));

  // TODO: Initialize all the other components missing from the index.html
  // ...
})(document.querySelector("#app"));

if (constants.debug) {
  document.querySelector("#app").classList.add("is-debug");
}

async function main() {
  await createRipple();
  await createThemeHandler();
  await language.setLanguage(storage.get("lang", constants.language));

  const appBar = new AppBar(document.querySelector(".ui-app-bar"), "");
  setAppBarHandlers(appBar);
  appBar.onMount();

  const stackLayout = new StackLayout(
    document.querySelector("main.container > .stack-layout"),
    appBar,
  );

  const calendarPage = new CalendarPage({ storage, language, appBar });

  stackLayout.setPage(calendarPage);
}

async function createRipple() {
  const elements = document.querySelectorAll("*[data-ripple]");
  elements.forEach(async (el) => {
    ripple.create(el, JSON.parse(el.getAttribute("data-ripple") || "{}"));
  });
}

async function createThemeHandler() {
  const themeHandler = new utils.theme.ThemeHandler();

  themeHandler.addTheme("zinc", "/themes/zinc.css");
  themeHandler.loadTheme(constants.theme.name);

  {
    /** @param {StorageDataTheme} data */
    const themeStorageHandler = (data) => {
      if (constants.debug) console.log(`[Main] storage: "theme"`, data);
      if (!!data?.mode) {
        themeHandler.stop();
        themeHandler.setMode(data.mode);
      } else {
        themeHandler.start();
      }
    };

    themeStorageHandler(storage.get("theme", null));
    storage.addListener("theme", themeStorageHandler);
  }

  return themeHandler;
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
}

window.addEventListener("DOMContentLoaded", main);
