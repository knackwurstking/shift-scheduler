import ui from "ui";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 */

const t = document.createElement("template");
t.innerHTML = `
`;

export class IndexedDBBrowserPage extends ui.wc.StackLayoutPage {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () =>
        customElements.define("indexeddb-browser-page", IndexedDBBrowserPage);

    constructor() {
        super();
        this.shadowRoot.appendChild(t.content.cloneNode(true));

        this.#store = document.querySelector("ui-store");
        this.#lang = document.querySelector("ui-lang");
    }

    connectedCallback() {
        super.connectedCallback();

        this.cleanup.add(
            this.#store.ui.on("lang", this.onLang.bind(this), true)
        );
    }

    /**
     * @private
     */
    onLang() {
        // TODO: ...
    }
}
