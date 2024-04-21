import ui from "ui"

export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {import("../../app").App | null} */
    #app = null;
    #initialized = false;

    #onLang = async () => {
        if (!this.app.language.getLanguage()) return;

        this.appBar.title.innerHTML = this.app.language.get("settings", "appBarTitle")
        this.misc.title.innerHTML =
            this.app.language.get("settings", "miscTitle");
        this.misc.weekStartPrimary.innerHTML =
            this.app.language.get("settings", "miscWeekStartPrimary");
        this.misc.weekStartSecondary.innerHTML =
            this.app.language.get("settings", "miscWeekStartSecondary");
        this.misc.theme.innerHTML =
            this.app.language.get("settings", "miscTheme");
    };

    #onThemeModeSelectChange = async (ev) => {
        /** @type {import("ui/src/wc/theme-handler").ThemeHandler} */
        const themeHandler = document.querySelector("#themeHandler")

        if (!ev.detail?.value || ev.detail?.value === "system") {
            // Enable auto mode
            themeHandler.removeAttribute("mode")
            themeHandler.setAttribute("auto", "");
        } else {
            // Disable auto mode and set theme manually
            themeHandler.removeAttribute("auto")
            themeHandler.setAttribute("mode", ev.detail.value)
        }

        themeHandler.connectedCallback()
    };

    constructor() {
        super();

        this.appBar = {
            title: document.querySelector("#appBarTitle"),
        };

        this.misc = {
            title: this.querySelector("#miscTitle"),
            weekStartPrimary: this.querySelector("#miscWeekStartPrimary"),
            weekStartSecondary: this.querySelector("#miscWeekStartSecondary"),
            theme: this.querySelector("#miscTheme"),

            themeModeSelect: this.querySelector("#miscThemeModeSelect"),
        };
    }

    get app() {
        return this.#app;
    }

    set app(app) {
        this.#app = app;

        if (super.isConnected && !this.#initialized) {
            this.#initialized = true;

            this.#app.storage.addListener("lang", this.#onLang);
            this.#onLang();

            this.misc.themeModeSelect.addEventListener("change", this.#onThemeModeSelectChange);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (!!this.app) {
            this.app = this.app;
        }
    }

    disconnectedCallback() {
        super.connectedCallback();
        this.#initialized = false;

        if (!!this.app) {
            this.#app.storage.removeListener("lang", this.#onLang);
            this.misc.themeModeSelect.addEventListener("change", this.#onThemeModeSelectChange);
        }
    }
}
