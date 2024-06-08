import * as ui from "ui";
import db from "../../db";
import { SvgRecycle } from "ui";

/**
 * @typedef {import("ui/src/ui-input").UIInputEvents} UIInputEvents
 * @typedef {import("../../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../types").DBDataEntry} DBDataEntry
 */

const filterHeight = "4rem";

// {{{ HTML Content
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
// }}}

export class IndexedDBBrowserPage extends ui.UIStackLayoutPage {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store
    /** @type {ui.UILang} */
    #lang

    static register = () => {
        SvgRecycle.register();

        customElements.define("indexeddb-browser-page", IndexedDBBrowserPage);
    }

    constructor() { // {{{
        super();
        this.shadowRoot.appendChild(t.content.cloneNode(true));

        this.#store = document.querySelector("ui-store");
        this.#lang = document.querySelector("ui-lang");

        this.classList.add("no-scrollbar");

        this.grid = new ui.UIFlexGrid();
        this.grid.setAttribute("gap", "0.5rem");
        this.grid.style.minWidth = "100%";
        this.grid.style.width = "fit-content";
        this.appendChild(this.grid);

        this.createSearchBar();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        this.cleanup.add(
            this.#store.ui.on("lang", this.onLang.bind(this), true)
        );

        this.renderEntries();
    } // }}}

    /**
     * @param {Object} values
     * @param {number | string | null} values.y
     * @param {number | string | null} values.m
     * @param {number | string | null} values.d
     */
    filter({ y, m, d }) { // {{{
        if (y === null) y = ".*";
        if (m === null) m = ".*";
        if (d === null) d = ".*";

        /**
         * @type {ui.UIFlexGridItem[]}
         */
        // @ts-expect-error
        const children = [...this.grid.children];
        children.forEach(child => {
            if (child.getAttribute("key").match(new RegExp(`${y}-${m}-${d}`))) {
                child.style.display = "block";
            } else {
                child.style.display = "none";
            }
        });
    } // }}}

    /**
     * @private
     */
    createSearchBar() { // {{{
        const [y, m, d] = this.getInputs();

        let values = {
            y: null,
            m: null,
            d: null,
        };

        y.ui.events.on("input", (/** @type {number} */value) => {
            values.y = isNaN(value) ? null : value;
            this.filter(values);
        });

        m.ui.events.on("input", (/** @type {number} */value) => {
            values.m = isNaN(value) ? null : value;
            this.filter(values);
        });

        d.ui.events.on("input", (/** @type {number} */value) => {
            values.d = isNaN(value) ? null : value;
            this.filter(values);
        });
    } // }}}

    /**
     * @private
     */
    async renderEntries() { // {{{
        const settings = this.#store.ui.get("settings");
        const entries = await db.getAll();
        entries.forEach((entry) => {
            setTimeout(() => {
                const item = new ui.UIFlexGridItem();

                const y = entry.year;
                const m = entry.month + 1;
                const d = entry.date;
                item.setAttribute("key", `${y}-${m}-${d}`);

                item.innerHTML = `
                    <table>
                        <tr>
                            <td style="width: 50%;">${y}</td>
                            <td style="width: 25%;">${m}</td>
                            <td style="width: 25%;">${d}</td>

                            <td>
                                <ui-icon-button
                                    style="float: right;"
                                    class="delete"
                                    color="destructive"
                                    ghost
                                >
                                    <svg-recycle></svg-recycle>
                                </ui-icon-button>
                            </td>
                        </tr>
                    </table>
                `;

                /** @type {ui.UIIconButton} */
                const deleteButton = item.querySelector("ui-icon-button.delete");
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
                    entry.shift = settings.shifts.find(
                        (shift) => shift.id === entry.shift.id
                    );

                    const row = document.createElement("tr");
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
                                user-select: text;
                            "
                        >
                            ${!!entry.shift?.visible
                            ? (entry.shift?.shortName || "&nbsp;")
                            : "&nbsp;"}
                        </td>
                    `;
                    item.querySelector("table").appendChild(row);
                }

                if (!!entry.note) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td colspan="5">
                            <pre
                                style="white-space: normal; user-select: text;"
                            >
                                ${entry.note.trim().replaceAll("\n", "<br/>") || "&nbsp;"}
                            </pre>
                        </td>
                    `;
                    item.querySelector("table").appendChild(row)
                }

                this.grid.appendChild(item);
            });
        });
    } // }}}

    /**
     * @private
     * @returns {NodeListOf<ui.UIInput<UIInputEvents, "number">>}
     */
    getInputs() { // {{{
        return this.shadowRoot.querySelectorAll("ui-input");
    } // }}}

    /**
     * @private
     */
    onLang() { // {{{
        const [y, m, d] = this.getInputs();
        y.ui.title = this.#lang.ui.get("indexeddb-browser", "input-title-year");
        m.ui.title = this.#lang.ui.get("indexeddb-browser", "input-title-month");
        d.ui.title = this.#lang.ui.get("indexeddb-browser", "input-title-date");
    } // }}}
}
