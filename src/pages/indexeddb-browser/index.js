import ui from "ui";
import { ShiftCard } from "../../components";
import db from "../../db";
import { html } from "../../utils";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").FlexGridRow} FlexGridRow
 * @typedef {import("ui/src/wc").IconButton} IconButton
 *
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
        this.grid.setAttribute("gap", "0.5rem");
        this.grid.style.minWidth = "100%";
        this.grid.style.width = "fit-content";
        this.appendChild(this.grid);

        // TODO: createSearchBar()
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

                const row = document.createElement("tr");
                content.appendChild(row);
                row.innerHTML = `
                    <td style="width: 5rem;">${entry.year}</td>

                    <td style="width: 3rem;">
                        ${(entry.month + 1).toString().padStart(2, "0")}
                    </td>

                    <td style="width: 3rem;">
                        ${entry.date.toString().padStart(2, "0")}
                    </td>

                    <td>
                        <ui-icon-button
                            style="float: right;"
                            class="delete"
                            color="destructive"
                            ghost
                        >
                            <ui-svg-delete-recycle-bin>
                            </ui-svg-delete-recycle-bin>
                        </ui-icon-button>
                    </td>
                `;

                /** @type {IconButton} */
                const deleteButton = row.querySelector("ui-icon-button.delete");
                deleteButton.onclick = async () => {
                    const message = this.#lang.ui.get(
                        "indexeddb-browser", "confirm-delete-entry"
                    ).replace("%d", entry.year.toString())
                        .replace("%d", entry.month.toString().padStart(2, "0"))
                        .replace("%d", entry.date.toString().padStart(2, "0"));

                    if (window.confirm(message)) {
                        await db.delete(entry.year, entry.month, entry.date);
                        this.grid.removeChild(item);
                    }
                }

                if (!!entry.shift) {
                    const row = document.createElement("tr");
                    content.appendChild(row);
                    row.innerHTML = `
                        <td
                            colspan="3"
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
                }

                if (!!entry.note) {
                    const row = document.createElement("tr");
                    content.appendChild(row);
                    row.innerHTML = `
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
