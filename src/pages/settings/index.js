import ui from "ui"

export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {import("../../app").App | null} */
    #app = null;
    #initialized = false;

    #onLang = () => {
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

    // TODO: handle theme (mode) picker
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

            this.#onLang()
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
        }
    }
}
