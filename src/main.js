import "./styles.css";

import App from "./app";
import { ShiftCard } from "./components";
import { CalendarPage, SettingsPage } from "./pages";
import utils from "./utils";

/**
 * @typedef {import("./types").UIStoreEvents} UIStoreEvents
 *
 * @typedef {import("ui/src/ui-store").UIStore<UIStoreEvents>} UIStore
 * @typedef {import("ui/src/ui-lang").UILang} UILang
 * @typedef {import("ui/src/ui-theme-handler").UIThemeHandler} UIThemeHandler 
 *
 * @typedef {import("./types").DebugStore} DebugStore
 * @typedef {import("./types").ThemeStore} ThemeStore 
 */

// Initialize Web Components {{{

// Define local components
App.register();
ShiftCard.register();
CalendarPage.register();
SettingsPage.register();

// }}}

// {{{ Initialize Theme

/** @type {UIThemeHandler} */
const th = document.querySelector("ui-theme-handler")
//th.ui.addTheme("zinc", `/themes/zinc.css`);

// }}}

// Initialize Store {{{

/** @type {UIStore} */
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
    utils.setTheme(data, th);
}, true);

// }}}

// {{{ Initialize Language

/** @type {UILang} */
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

window.addEventListener("DOMContentLoaded", () => {
    new App(store).run();
});
