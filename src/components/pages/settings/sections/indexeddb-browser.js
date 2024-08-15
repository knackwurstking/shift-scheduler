import { CleanUp, html } from "ui";
import { IndexedDBBrowserPage } from "../../indexeddb-browser";
import { pages } from "../../../../data/constants";

export class IndexedDBBrowser extends HTMLElement {
    static register = () => {
        customElements.define("settings-indexeddb-browser", IndexedDBBrowser);
    };

    constructor() {
        super();

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");
        /** @type {import("ui").UIStackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.pages = {
            dbBrowser: new IndexedDBBrowserPage(),
        };

        this.label;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-label>
                <ui-button color="primary" variant="full"></ui-button>
            </ui-label>
        `;

        /** @type {import("ui").UILabel} */
        this.label = this.querySelector("ui-label");
        this.label.ui.inputSlot[0].onclick = async () => {
            this.stackLayout.ui.set(pages.dbBrowser, null, true);
        };
    }

    connectedCallback() {
        this.cleanup.add(
            this.uiStore.ui.on("lang", this.storeHandlerLang.bind(this), true),
        );
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    /** @private */
    async storeHandlerLang() {
        this.label.ui.primary = this.uiLang.ui.get(
            "settings",
            "label-primary-indexeddb-browser",
        );
        this.label.ui.inputSlot[0].innerHTML = this.uiLang.ui.get(
            "settings",
            "button-indexeddb-browser",
        );
    }
}
