import ui from "ui";
import db from "../../db";

/**
 * @typedef {import("../../types").StoreEvents} StoreEvents
 * @typedef {import("ui/src/wc/input").InputEvents} InputEvents
 *
 * @typedef {import("ui/src/wc").Store<StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").FlexGridRow} FlexGridRow
 * @typedef {import("ui/src/wc").IconButton} IconButton
 * @typedef {import("ui/src/wc").Input<InputEvents, "number">} NumberInput
 *
 * @typedef {import("../../types").DBDataEntry} DBDataEntry
 */

const filterHeight = "4rem";

const t = document.createElement("template");
t.innerHTML = `
    <style>
        :host {
            width: 100%;
            height: 100%;
            overflow: auto;
            padding-top: var(--ui-app-bar-height);
            padding-bottom: ${filterHeight};
        }

        .filter {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 0;
            height: ${filterHeight};
            border-top: 1px solid var(--ui-borderColor);
        }

        .filter .bg {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: var(--ui-backdrop-bgColor);
            backdrop-filter: var(--ui-backdropFilter);
        }
    </style>

    <slot></slot>

    <div class="filter">
        <div class="bg"></div>
        <ui-flex-grid>
            <ui-flex-grid-row>
                <ui-flex-grid-item>
                    <ui-input title="Year" type="number"></ui-input>
                </ui-flex-grid-item>

                <ui-flex-grid-item>
                    <ui-input title="Month" type="number"></ui-input>
                </ui-flex-grid-item>

                <ui-flex-grid-item>
                    <ui-input title="Day" type="number"></ui-input>
                </ui-flex-grid-item>
            </ui-flex-grid-row>
        </ui-flex-grid>
    </div>
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

        this.createSearchBar();
    }

    connectedCallback() {
        super.connectedCallback();

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true)
            );
        });

        this.renderEntries();
    }

    /**
     * @private
     */
    createSearchBar() {
        /**
         * @type {NodeListOf<NumberInput>}
         */
        const [y, m, d] = this.shadowRoot.querySelectorAll("ui-input");

        y.ui.events.on("input", (/** @type {number} */value) => {
            // TODO: ...
        })

        m.ui.events.on("input", (/** @type {number} */value) => {
            // TODO: ...
        })

        d.ui.events.on("input", (/** @type {number} */value) => {
            // TODO: ...
        })
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
