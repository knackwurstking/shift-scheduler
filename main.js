import "./node_modules/ui/css/main.css";
import "./styles/main.css";

import { utils } from "ui";
import AppBar from "./lib/app-bar";
import constants from "./lib/constants";
import Language from "./lib/language";
import StackLayout from "./lib/stack-layout";
import Storage from "./lib/storage";
import CalendarPage from "./pages/calendar";

const storage = new Storage();
const language = new Language();

storage.addListener("lang", async (/**@type{StorageDataLang}*/ data) => {
  if (constants.debug) console.log(`[Main] storage: "lang"`, data);
  await language.setLanguage(data || constants.language);
  storage.dispatch("week-start"); // This will trigger an update on the calendar week days
});

((/**@type{HTMLElement}*/ app) => {
  /*
   * Enable debugging (red) borders
   */
  if (constants.debug) app.classList.add("is-debug");

  /*
   * Main function
   */
  (async (/**@type{AppBar}*/ appBar) => {
    createThemeHandler(new utils.theme.ThemeHandler());
    await language.setLanguage(storage.get("lang", constants.language));

    setAppBarHandlers(appBar).then((appBar) => appBar.onMount());

    new StackLayout(
      document.querySelector("main.container > .stack-layout"),
      appBar,
    ).setPage(new CalendarPage({ storage, language, appBar }));
  })(new AppBar());
})(document.querySelector("#app"));

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
  appBar.getElement("backButton").element.onclick = () => {
    // ...
  };

  appBar.getElement("datePickerButton").element.onclick = () => {
    // ...
  };

  appBar.getElement("editButton").element.onclick = () => {
    // Add the edit mode (footer), dont forget to apply the class ".edit-mode" to the main container
  };

  appBar.getElement("todayButton").element.onclick = () => {
    appBar.datePicker.date = new Date();
  };

  appBar.getElement("pdfButton").element.onclick = () => {
    // ...
  };

  appBar.getElement("settingsButton").element.onclick = () => {
    // ...
  };

  return appBar;
}
