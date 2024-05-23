import ui from "ui";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 */

const t = document.createElement("template");
t.innerHTML = ``;

export class PDFPage extends ui.wc.StackLayoutPage {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    static register = () => {
        customElements.define("pdf-page", PDFPage);
    };

    constructor() {
        super();
        this.shadowRoot.appendChild(t.cloneNode(true));

        /** @type {Store} */
        this.#store = document.querySelector("ui-store")
        /** @type {Lang} */
        this.#lang = document.querySelector("ui-lang")
    }
}
