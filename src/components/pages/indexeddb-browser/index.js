import svgTrash from "ui/src/svg/smoothie-line-icons/trash";

import { UIStackLayoutPage, html } from "ui";
import { pages } from "../../../data/constants";
import { CleanUp } from "ui";
import { db } from "../../../lib";
import { UIFlexGridItem } from "ui";

/**
 * @typedef Values
 * @type {{
 *   y: string | null;
 *   m: string | null;
 *   d: string | null;
 * }}
 */

const filterHeight = "4.25rem";

/**
 * HTML: `indexeddb-browser-page`
 */
export class IndexedDBBrowserPage extends UIStackLayoutPage {
    static register = () => {
        customElements.define("indexeddb-browser-page", IndexedDBBrowserPage);
    };

    constructor() {
        super(pages.dbBrowser);

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.render();
    }

    render() {
        this.className = "no-scrollbar";

        this.style.width = "100%";
        this.style.height = "100%";
        this.style.overflowY = "auto";
        this.style.paddingTop = "var(--ui-app-bar-height)";
        this.style.paddingBottom = `${filterHeight}`;

        this.innerHTML = html`
            <ui-flex-grid
                style="min-width: 100%; width: fit-content;"
                class="content"
                gap="0.5rem"
            >
            </ui-flex-grid>

            <div
                style="
                    position: fixed;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    height: ${filterHeight};
                    border-top: 1px solid var(--ui-borderColor);
                "
            >
                <div
                    style="
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        background-color: var(--ui-backdrop-bgColor);
                        backdrop-filter: var(--ui-backdropFilter);
                    "
                ></div>

                <ui-flex-grid>
                    <ui-flex-grid-row style="padding: 0.25rem;" gap="0.125rem">
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

        // Initialize filter bar
        const [y, m, d] = this.getInputs();

        /** @type {Values} */
        let values = { y: null, m: null, d: null };

        y.ui.events.on("input", (value) => {
            values.y = value || null;
            this.filter(values);
        });

        m.ui.events.on("input", (value) => {
            values.m = value || null;
            this.filter(values);
        });

        d.ui.events.on("input", (value) => {
            values.m = value || null;
            this.filter(values);
        });
    }

    connectedCallback() {
        super.connectedCallback();

        this.cleanup.add(
            this.uiStore.ui.on("lang", this.storeHandlerLang.bind(this), true),
        );

        this.renderEntries();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanup.run();
    }

    /** @param {Values} values */
    filter({ y, m, d }) {
        if (y === null) y = ".*";
        if (m === null) m = ".*";
        if (d === null) d = ".*";

        /** @type {UIFlexGridItem[]} */
        Array.from(this.querySelector(`ui-flex-grid.content`).children).forEach(
            (/** @type {HTMLElement} */ child) => {
                if (
                    child
                        .getAttribute("key")
                        .match(new RegExp(`${y}-${m}-${d}`))
                ) {
                    child.style.display = "block";
                } else {
                    child.style.display = "none";
                }
            },
        );
    }

    /**
     * @private
     * @returns {import("ui").UIInput<import("ui").UIInput_Events>[]}
     */
    getInputs() {
        return Array.from(this.querySelectorAll("ui-input"));
    }

    /** @private */
    async renderEntries() {
        const settings = this.uiStore.ui.get("settings");
        const entries = await db.getAll();
        const content = this.querySelector("ui-flex-grid.content");
        entries.forEach((entry) => {
            setTimeout(() => {
                const item = new UIFlexGridItem();

                const y = entry.year;
                const m = entry.month + 1;
                const d = entry.date;
                item.setAttribute("key", `${y}-${m}-${d}`);

                item.innerHTML = html`
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
                                    ${svgTrash}
                                </ui-icon-button>
                            </td>
                        </tr>
                    </table>
                `;

                /** @type {import("ui").UIIconButton} */
                const deleteButton = item.querySelector(
                    "ui-icon-button.delete",
                );

                deleteButton.onclick = async () => {
                    const message = this.uiLang.ui
                        .get("indexeddb-browser", "confirm-delete-entry")
                        .replace("%d", entry.year.toString())
                        .replace("%d", entry.month.toString().padStart(2, "0"))
                        .replace("%d", entry.date.toString().padStart(2, "0"));

                    if (window.confirm(message)) {
                        await db.delete(entry.year, entry.month, entry.date);
                        content.removeChild(item);
                    }
                };

                if (!!entry.shift) {
                    entry.shift = settings.shifts.find(
                        (shift) => shift.id === entry.shift.id,
                    );

                    const row = document.createElement("tr");
                    row.innerHTML = html`
                        <td colspan="3" style="user-select: text;">
                            ${entry.shift?.name || "&nbsp;"}
                        </td>

                        <td
                            style="
                                color: ${entry.shift?.color || "inherit"};
                                user-select: text;
                            "
                        >
                            ${!!entry.shift?.visible
                                ? entry.shift?.shortName || "&nbsp;"
                                : "&nbsp;"}
                        </td>
                    `;
                    item.querySelector("table").appendChild(row);
                }

                if (!!entry.note) {
                    const row = document.createElement("tr");
                    row.innerHTML = html`
                        <td colspan="5">
                            <pre
                                style="white-space: normal; user-select: text;"
                            >
                                ${entry.note.trim().replaceAll("\n", "<br/>") ||
                                "&nbsp;"}
                            </pre
                            >
                        </td>
                    `;
                    item.querySelector("table").appendChild(row);
                }

                content.appendChild(item);
            });
        });
    }

    /** @private */
    storeHandlerLang() {
        const [y, m, d] = this.getInputs();

        y.ui.title = this.uiLang.ui.get(
            "indexeddb-browser",
            "input-title-year",
        );

        m.ui.title = this.uiLang.ui.get(
            "indexeddb-browser",
            "input-title-month",
        );

        d.ui.title = this.uiLang.ui.get(
            "indexeddb-browser",
            "input-title-date",
        );
    }
}
