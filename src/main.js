import "./styles.css";

import ui from "ui";
import App from "./app";
import { ShiftCard } from "./components";
import { CalendarPage, SettingsPage, PDFPage } from "./pages";
import utils from "./utils";

/**
 * @typedef {import("ui/src/wc/store/store").Store<import("./types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").ThemeHandler} ThemeHandler 
 *
 * @typedef {import("./types").DebugStore} DebugStore
 * @typedef {import("./types").ThemeStore} ThemeStore 
 */

// Initialize Web Components {{{

ui.defineSVG()
    .catch((err) => alert(`Rendering SVG web components failed: ${err}`));

ui.define()
    .then(() => {
        App.register();
        ShiftCard.register()
        CalendarPage.register()
        SettingsPage.register()
        PDFPage.register()
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

// }}}

// {{{ Initialize Theme

/** @type {ThemeHandler} */
const th = document.querySelector("#themeHandler")
//th.ui.addTheme("zinc", `/themes/zinc.css`);

// }}}

// Initialize Store {{{

/** @type {Store} */
const store = document.querySelector("ui-store");

store.ui.set("date-picker", (new Date()).toString(), true);
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

/** @type {Lang} */
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
