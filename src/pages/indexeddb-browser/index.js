import ui from "ui";
import { ShiftCard } from "../../components";
import db from "../../db";
import { html } from "../../utils";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").FlexGridRow} FlexGridRow
 * @typedef {import("../../types").DBDataEntry} DBDataEntry
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
        this.grid.style.minWidth = "100%";
        this.grid.style.width = "fit-content";
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
        const entries = await db.getAll();
        entries.forEach((entry) => {
            setTimeout(() => {
                const item = new ui.wc.FlexGridItem();
                const content = document.createElement("table");

                const row1 = document.createElement("tr");
                content.appendChild(row1);
                row1.innerHTML = `
                    <td style="width: 5rem;">${entry.year}</td>

                    <td style="width: 3rem;">
                        ${(entry.month + 1).toString().padStart(2, "0")}
                    </td>

                    <td style="width: 3rem;">
                        ${entry.date.toString().padStart(2, "0")}
                    </td>

                    <td
                        style="user-select: text;"
                    >
                        ${entry.shift?.name || "&nbsp;"}
                    </td>

                    <td
                        style="
                            color: ${entry.shift?.color || 'inherit'};
                            width: 4rem;
                            user-select: text;
                        "
                    >
                        ${!!entry.shift?.visible
                        ? (entry.shift?.shortName || "&nbsp;")
                        : "&nbsp;"}
                    </td>
                `;

                if (!!entry.note) {
                    const row2 = document.createElement("tr");
                    content.appendChild(row2);
                    row2.innerHTML = `
                        <td colspan="5">
                            <pre
                                style="white-space: normal; user-select: text;"
                            >
                                ${entry.note.trim().replaceAll("\n", "<br/>") || "&nbsp;"}
                            </pre>
                        </td>
                    `;
                }

                item.appendChild(content);
                this.grid.appendChild(item);
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
