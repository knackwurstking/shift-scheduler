import ui from "ui";
import { html } from "ui/src/js/utils";
import { IndexedDBBrowserPage } from "../../indexeddb-browser";

/**
 * @typedef {import("ui/src/wc").Store<import("../../../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
 */

const innerHTML = html`
<ui-label>
    <ui-button color="primary" variant="full"></ui-button>
</ui-label>
`;

export class IndexedDBBrowser extends HTMLElement {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    /** @type {Label} */
    #label;
    /** @type {Button} */
    #button

    static register = () => {
        customElements.define("settings-indexeddb-browser", IndexedDBBrowser);
        IndexedDBBrowserPage.register();
    };

    /**
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        this.cleanup = new ui.js.CleanUp();

        this.#store = store;
        this.#lang = lang;

        /**
         * @private
         * @type {StackLayout}
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

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true)
            );
        });
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
        this.stackLayout.ui.unregisterPage("indexeddb-browser");
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
