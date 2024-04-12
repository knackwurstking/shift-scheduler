import "./node_modules/ui/css/main.css";
import "./styles/main.css";

import { ripple, svg, utils } from "ui";
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

document.querySelector("#app").innerHTML = `
<main class="container ui-container">
    <div class="stack-layout"></div>
</main>

<header class="ui-app-bar ui-app-bar-top">
    <div class="ui-app-bar-main ui-container">
        <div>
            <div class="ui-grid-row">
                <button
                    class="app-bar-back-button ui-icon-button ghost primary"
                    data-ripple="{}"
                >
                    ${svg.BackArrowNavigation}
                </button>

                <button
                    class="app-bar-date-picker ui-button outline primary"
                    data-ripple="{}"
                >
                    Date Picker
                </button>
            </div>
        </div>

        <div>
            <h4 class="app-bar-title"></h4>
        </div>

        <div>
            <button
                class="app-bar-edit-mode ui-icon-button ghost primary"
                data-ripple="{}"
            >
                ${svg.Edit2}
            </button>

            <button
                class="app-bar-today ui-icon-button ghost primary"
                data-ripple="{}"
            >
                ${svg.TodayOutline}
            </button>

            <button
                class="app-bar-pdf ui-icon-button ghost primary"
                data-ripple="{}"
            >
                ${svg.PDFDocument}
            </button>

            <button
                class="app-bar-settings ui-icon-button ghost primary"
                data-ripple="{}"
            >
                ${svg.Settings}
            </button>
        </div>
    </div>
</header>`;

if (constants.debug) {
  document.querySelector("#app").classList.add("is-debug");
}

async function main() {
  await createRipple(); // TDOO: Using create button function from the "ui" `ui.button.create`
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
