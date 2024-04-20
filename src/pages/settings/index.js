import ui from "ui"

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
