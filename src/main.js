import "./styles.css";

import ui from "ui";
import { App } from "./app";
import { CalendarPage, EditRhythm, SettingsPage, StartDate } from "./pages";

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

/** @type {import("ui/src/wc").Store} */
const store = document.querySelector("ui-store");

store.data.set("date-picker", (new Date()).toString(), true);
store.data.set("theme", { mode: "system", name: "zinc" }, true);
store.data.set("week-start", 0, true);
store.data.set("settings", { shifts: [], rhythm: [], startDate: "" }, true);
store.data.set("debug", false, true);

store.data.on("debug", (/**@type{import("./types").DebugStore}*/state) => {
    if (state) {
        document.querySelector("#app").classList.add("is-debug")
    } else {
        document.querySelector("#app").classList.remove("is-debug")
    }
}, true)

// }}}

// {{{ Initialize Language

/** @type {import("ui/src/wc").Lang} */
const lang = document.querySelector("ui-lang")

// TODO: Auto language detection handler here...
// ...

lang.data.on("change", (lt) => {
    if (!lt) {
        console.log("[main] No language set for now!")
        return
    }

    console.log(`[main] current language in use:`, lt)
    store.data.set("lang", lt.name, true);
}, true)

// }}}

// {{{ Initialize Theme

/** @type {import("ui/src/wc").ThemeHandler} */
const th = document.querySelector("#themeHandler")
th.addTheme("zinc", `/themes/zinc.css`);
th.addTheme("green", `/themes/green.css`);

// }}}

new App(store).run();
