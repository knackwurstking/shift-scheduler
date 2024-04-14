import "./node_modules/ui/css/main.css";
import "./styles/main.css";

import { utils } from "ui";
import AppBar from "./components/app-bar";
import constants from "./lib/constants";
import Language from "./lib/language";
import StackLayout from "./lib/stack-layout";
import Storage from "./lib/storage";
import CalendarPage from "./pages/calendar";

// TODO: Convert old style to new style

class Main {
  /**
   * @param {Element} app
   */
  constructor(app) {
    this.app = app;
    this.storage = new Storage();
    this.language = new Language();
  }

  onMount() {
    this.storage.addListener(
      "lang",
      async (/**@type{import("./lib/storage").StorageDataLang}*/ data) => {
        if (constants.debug) console.log(`[Main] storage: "lang"`, data);
        await this.language.setLanguage(data || constants.language);
        this.storage.dispatch("week-start"); // This will trigger an update on the calendar week days
      },
    );

    return this;
  }

  onDestroy() {
    return this;
  }

  run() {
    return this;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const main = new Main(document.querySelector("#app")).onMount().run();

  // Enable debugging borders
  if (constants.debug) main.app.classList.add("is-debug");
});

/*
 * Old
 */

(() => {
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
    ).setPage(new CalendarPage(storage, language, appBar));
  })(new AppBar());
})();

async function createThemeHandler(/**@type{utils.theme.ThemeHandler}*/ th) {
  th.addTheme("zinc", "/themes/zinc.css").loadTheme(constants.theme.name);

  storage.addListener(
    "theme",
    (/**@type{import("./lib/storage").StorageDataTheme}*/ data) => {
      if (constants.debug) console.log(`[Main] storage: "theme"`, data);
      if (!!data?.mode) {
        th.stop().setMode(data.mode);
      } else {
        th.start();
      }
    },
  );
  storage.dispatch("theme");

  return th;
}

/**
 * @param {AppBar} appBar
 */
async function setAppBarHandlers(appBar) {
  appBar.getComponent("backButton").element.onclick = () => {
    // ...
  };

  appBar.getComponent("datePickerButton").element.onclick = () => {
    // ...
  };

  appBar.getComponent("editButton").element.onclick = () => {
    // Add the edit mode (footer), dont forget to apply the class ".edit-mode" to the main container
  };

  appBar.getComponent("todayButton").element.onclick = () => {
    appBar.datePicker.date = new Date();
  };

  appBar.getComponent("pdfButton").element.onclick = () => {
    // ...
  };

  appBar.getComponent("settingsButton").element.onclick = () => {
    // TODO: go to settings page (using the stack layout)
  };

  return appBar;
}
