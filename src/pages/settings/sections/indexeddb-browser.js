import { UIButton, UILabel } from "ui";
import { CleanUp } from "ui/src/js";
import { IndexedDBBrowserPage } from "../../indexeddb-browser";

/**
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
 */

const innerHTML = `
<ui-label>
    <ui-button color="primary" variant="full"></ui-button>
</ui-label>
`;

export class IndexedDBBrowser extends HTMLElement {

    static register = () => {
        UILabel.register();
        UIButton.register();

        IndexedDBBrowserPage.register();

        customElements.define("settings-indexeddb-browser", IndexedDBBrowser);
    };

    /**
     * @param {import("ui").UIStore<UIStoreEvents>} store
     * @param {import("ui").UILang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        /** @type {import("ui").UIStore<UIStoreEvents>} */
        this.uiStore = store;
        /** @type {import("ui").UILang} */
        this.uiLang = lang;

        this.cleanup = new CleanUp();

        /**
         * @private
         * @type {import("ui").UIStackLayout}
         */
        this.stackLayout = document.querySelector("ui-stack-layout");

        /** @type {UILabel} */
        this.label = this.querySelector("ui-label");

        /** @type {UIButton} */
        this.button = this.querySelector("ui-button");
        this.createButton()
    } // }}}

    connectedCallback() { // {{{
        this.stackLayout.ui.registerPage("indexeddb-browser", () => {
            const t = document.createElement("template");
            t.innerHTML = `
                <indexeddb-browser-page name="indexeddb-browser"></indexeddb-browser-page>
            `;
            return t.content.cloneNode(true);
        });

        this.cleanup.add(() =>
            this.stackLayout.ui.unregisterPage("indexeddb-browser"));

        this.cleanup.add(
            this.uiStore.ui.on("lang", this.onLang.bind(this), true)
        );
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
    } // }}}

    /** @private */
    createButton() { // {{{
        this.button.onclick = async () => {
            this.stackLayout.ui.setPage("indexeddb-browser");
        };
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.label.ui.primary = this.uiLang.ui.get("settings", "label-primary-indexeddb-browser");
        this.button.innerHTML = this.uiLang.ui.get("settings", "button-indexeddb-browser")
    } // }}}
}
