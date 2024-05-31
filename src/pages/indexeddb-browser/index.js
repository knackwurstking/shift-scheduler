import ui from "ui";
import { ShiftCard } from "../../components";
import db from "../../db";
import { html } from "../../utils";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 */

const t = document.createElement("template");
t.innerHTML = html`
    <style>
        :host {
            width: 100%;
            height: 100%;
            overflow: auto;
            padding-top: var(--ui-app-bar-height);
        }
    </style>

    <slot></slot>
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

        this.classList.add("no-scrollbar");
        this.grid = new ui.wc.FlexGrid();
        this.grid.setAttribute("gap", "0.25rem");
        this.appendChild(this.grid);
    }

    connectedCallback() {
        super.connectedCallback();

        this.cleanup.add(
            this.#store.ui.on("lang", this.onLang.bind(this), true)
        );

        this.renderEntries()
    }

    /**
     * @private
     */
    async renderEntries() {
        (await db.getAll()).forEach((entry) => {
            setTimeout(() => {
                const row = new ui.wc.FlexGridRow();
                row.setAttribute("gap", "0.25rem");

                { // Year
                    const item = new ui.wc.FlexGridItem();
                    item.setAttribute("flex", "0");
                    item.className = "flex align-center";

                    const content = new ui.wc.Primary();
                    content.innerHTML = `${entry.year}`;
                    item.appendChild(content);

                    row.appendChild(item);
                }

                // Month
                {
                    const item = new ui.wc.FlexGridItem();
                    item.setAttribute("flex", "0");
                    item.className = "flex align-center";

                    const content = new ui.wc.Primary();
                    content.innerHTML = (entry.month + 1).toString().padStart(2, "0");
                    item.appendChild(content);

                    row.appendChild(item);
                }

                // Date
                {
                    const item = new ui.wc.FlexGridItem();
                    item.setAttribute("flex", "0");
                    item.className = "flex align-center";

                    const content = new ui.wc.Primary();
                    content.innerHTML = entry.date.toString().padStart(2, "0");
                    item.appendChild(content);

                    row.appendChild(item);
                }

                // Shift
                if (!!entry.shift) {
                    const item = new ui.wc.FlexGridItem();
                    item.setAttribute("flex", "0");
                    item.className = "flex align-center";

                    const shiftCard = new ShiftCard();
                    shiftCard.setAttribute("color", entry.shift.color || 'inherit');
                    if (!!entry.shift.visible ? 'visible' : '') {
                        shiftCard.setAttribute("visible", "");
                    } else {
                        shiftCard.removeAttribute("visible");
                    }

                    const name = document.createElement("span");
                    name.slot = "name";
                    name.innerHTML = entry.shift.name;
                    shiftCard.appendChild(name);

                    const shortName = document.createElement("span");
                    shortName.slot = "short-name";
                    shortName.innerHTML = entry.shift.shortName;
                    shiftCard.appendChild(shortName);

                    item.appendChild(shiftCard);
                    row.appendChild(item);
                }

                if (!!entry.note) {
                    const item = new ui.wc.FlexGridItem();
                    item.setAttribute("flex", "0");
                    item.className = "flex align-center";

                    const content = document.createElement("pre");
                    content.innerHTML = `${entry.note}`;
                    item.appendChild(content);

                    row.appendChild(item);
                }

                // TODO: Action Buttons: "Delete"

                this.grid.appendChild(row);
            });
        });
    }

    /**
     * @private
     */
    onLang() {
        // TODO: ...
    }
}
