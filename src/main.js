import "./styles.css";

import ui from "ui";
import App from "./app";
import { CalendarPage, EditRhythm, SettingsPage, StartDate } from "./pages";

/**
 * @typedef {import("ui/src/wc/store/store").Store<import("./types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").ThemeHandler} ThemeHandler 
 *
 * @typedef {import("./types").DebugStore} DebugStore
 */

// Initialize Web Components {{{

ui.defineSVG()
    .catch((err) => alert(`Rendering SVG web components failed: ${err}`));

ui.define()
    .then(() => {
        CalendarPage.register()
        SettingsPage.register()
        StartDate.register()
        EditRhythm.register()
    })
    .catch((err) => alert(`Rendering web components failed: ${err}`));

// }}}

// Initialize Store {{{

/** @type {Store} */
const store = document.querySelector("ui-store");

store.ui.set("date-picker", (new Date()).toString(), true);
store.ui.set("theme", { mode: "system", name: "zinc" }, true);
store.ui.set("week-start", 0, true);
store.ui.set("settings", { shifts: [], rhythm: [], startDate: "" }, true);
store.ui.set("debug", false, true);

store.ui.on("debug", (/** @type{DebugStore} */ state) => {
    if (state) {
        document.querySelector("#app").classList.add("is-debug")
    } else {
        document.querySelector("#app").classList.remove("is-debug")
    }
}, true)

// }}}

// {{{ Initialize Language

/** @type {Lang} */
const lang = document.querySelector("ui-lang")

// TODO: Auto language detection handler here...
// ...
lang.setAttribute("current", "en") // NOTE: placeholder

lang.ui.on("change", (langTypeElement) => {
    if (!langTypeElement) {
        console.log("[main] No language set for now!")
        return
    }

    console.log(`[main] current language in use:`, langTypeElement)
    // @ts-expect-error - `langTypeElement.ui.name` is from type string, not `LangStore`
    store.ui.set("lang", langTypeElement.ui.name, true);
}, true)

// }}}

// {{{ Initialize Theme

/** @type {ThemeHandler} */
const th = document.querySelector("#themeHandler")
th.ui.addTheme("zinc", `/themes/zinc.css`);
th.ui.addTheme("green", `/themes/green.css`);

// }}}

window.addEventListener("DOMContentLoaded", () => {
    new App(store).run()
    document.body.style.display = "block"
});
