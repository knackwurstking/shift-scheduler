import ui from "ui";
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
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    /** @type {ui.UILabel} */
    #label;
    /** @type {ui.UIButton} */
    #button

    static register = () => {
        customElements.define("settings-indexeddb-browser", IndexedDBBrowser);
        IndexedDBBrowserPage.register();
    };

    /**
     * @param {ui.UIStore<UIStoreEvents>} store
     * @param {ui.UILang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        this.cleanup = new ui.js.CleanUp();

        this.#store = store;
        this.#lang = lang;

        /**
         * @private
         * @type {ui.UIStackLayout}
         */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.#label = this.querySelector("ui-label");
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

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true)
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
    } // }}}

    /** @private */
    createButton() { // {{{
        this.#button = this.querySelector("ui-button");
        this.#button.onclick = async () => {
            this.stackLayout.ui.setPage("indexeddb-browser");
        };
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.#label.ui.primary = this.#lang.ui.get("settings", "label-primary-indexeddb-browser");
        this.#button.innerHTML = this.#lang.ui.get("settings", "button-indexeddb-browser")
    } // }}}
}
