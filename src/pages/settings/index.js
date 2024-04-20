import ui from "ui"

// TODO: language support: app-bar title, misc week-start checkbox (primary/secondary)
export class SettingsPage extends ui.wc.StackLayoutPage {
    /** @type {import("../../app").App | null} */
    #app = null;
    #initialized = false;

    constructor() {
        super();
    }

    get app() {
        return this.#app
    }

    set app(app) {
        this.#app = app

        if (super.isConnected && !this.#initialized) {
            this.#initialized = true

            // TODO: connectedCallback shit here
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (!!this.app) {
            this.app = this.app
        }
    }

    disconnectedCallback() {
        super.connectedCallback();
        this.#initialized = false;

        if (!!this.app) {
            // ...
        }
    }
}
