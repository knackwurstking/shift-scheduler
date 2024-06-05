import "./styles.css";

import * as ui from "ui";
import App from "./app";
import { ShiftCard } from "./components";
import { CalendarPage, SettingsPage } from "./pages";
import utils from "./utils";

/**
 * @typedef {import("./types").UIStoreEvents} UIStoreEvents
 * @typedef {import("./types").DebugStore} DebugStore
 * @typedef {import("./types").ThemeStore} ThemeStore 
 */

// {{{ Initialize Svg and Web Components
ui.SvgDeleteRecycleBin.register();
ui.SvgBackArrowNavigation.register();
ui.SvgEdit2.register();
ui.SvgTodayOutline.register();
ui.SvgPDFDocument.register();
ui.SvgSettings.register();

ui.UIThemeHandler.register();
ui.UILabel.register();
ui.UIStore.register();
ui.UIStackLayout.register();
ui.UISpinner.register();
ui.UILang.register();
ui.UILangType.register();
ui.UIInput.register();
ui.UISelect.register();
ui.UISelectOption.register();
ui.UIFlexGrid.register();
ui.UIFlexGridRow.register();
ui.UIFlexGridItem.register();
ui.UIDialog.register();
ui.UIContainer.register();
ui.UIButton.register();
ui.UIIconButton.register();
ui.UIAppBar.register();

// Define local components
App.register();
ShiftCard.register();
CalendarPage.register();
SettingsPage.register();
// }}}

// {{{ Initialize Store
/** @type {ui.UIStore<UIStoreEvents>} */
const store = document.querySelector("ui-store");

{
    const t = new Date();
    store.ui.set(
        "date-picker",
        new Date(t.getFullYear(), t.getMonth(), 1).toString(),
        true
    );
}
store.ui.set("theme", { mode: "system", name: "zinc" }, true);
store.ui.set("week-start", 0, true);
store.ui.set("settings", { shifts: [], rhythm: [], startDate: "" }, true);
store.ui.set("debug", false, true);
store.ui.set("edit-mode", { open: false, active: null }, true);

store.ui.on("debug", (/** @type{DebugStore} */ state) => {
    if (state) {
        document.querySelector("#app").classList.add("is-debug")
    } else {
        document.querySelector("#app").classList.remove("is-debug")
    }
}, true)

store.ui.on("theme", (/** @type {ThemeStore} */ data) => {
    console.debug(`[app] current theme in use:`, data)
    utils.setTheme(data, document.querySelector("ui-theme-handler"));
}, true);
// }}}

// {{{ Initialize Language
/** @type {ui.UILang} */
const lang = document.querySelector("ui-lang")

lang.ui.on("change", (langTypeElement) => {
    if (!langTypeElement) {
        console.debug("[main] No language set for now!")
        return
    }

    console.debug(`[main] current language in use:`, langTypeElement)
    // @ts-expect-error - `langTypeElement.ui.name` is from type string, not `LangStore`
    store.ui.set("lang", langTypeElement.ui.name, true);
});

// Auto language detection handler here...
for (const l of ["en", "de"]) {
    if (navigator.language.match(new RegExp(`^${l}`, "i"))) {
        console.debug(`Got a match here for "${l}":`, navigator.language);
        lang.setAttribute("current", l);
        break;
    }
    // NOTE: No need for iterating through `navigator.languages`, only two languages are supported for now.
}
if (!lang.hasAttribute("current")) {
    lang.setAttribute("current", lang.ui.getFallbackElement().ui.name);
}
// }}}

new App(store).run();
