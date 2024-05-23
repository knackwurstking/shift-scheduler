import ui from "ui";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 */

const t = document.createElement("template");
t.innerHTML = `
    <style>
        * { border: 1px solid red; }

        :host {
            padding-top: var(--ui-app-bar-height);
        }
    </style>

    <ui-flex-grid gap="0.25rem">
        <ui-flex-grid-item>
            <!-- TODO: year picker -->
        </ui-flex-grid-item>

        <ui-flex-grid-item>
            <!-- TODO: preview -->
        </ui-flex-grid-item>
    </ui-flex-grid>
`;

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
        this.shadowRoot.appendChild(t.content.cloneNode(true));

        /** @type {Store} */
        this.#store = document.querySelector("ui-store");
        /** @type {Lang} */
        this.#lang = document.querySelector("ui-lang");
    }
}
