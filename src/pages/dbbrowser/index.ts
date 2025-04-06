import * as ui from "ui";

import { appBarUtils, db, html } from "@lib";

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    appBarTitleBackup = appBarUtils.getTitle();
    appBarUtils.setTitle("DB-Browser");

    document.querySelector("#routerTarget")!.innerHTML = await getHTML();
}

export async function onDestroy() {
    appBarUtils.setTitle(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

async function getHTML(): Promise<string> {
    const dbEntries = await db.getAll();
    const lastIndex = dbEntries.length - 1;

    const entryItems: string[] = dbEntries.map((entry, i) => {
        const m = (entry.month + 1).toString().padStart(2, "0");
        const d = entry.date.toString().padStart(2, "0");

        let note: string = "";
        if (entry.note) {
            note = html`<pre class="ui-flex-grid-item">${entry.note}</pre>`;
        }

        let borderBottom = "none";
        if (i !== lastIndex) {
            borderBottom =
                "var(--ui-border-width) var(--ui-border-style) var(--ui-border-color)";
        }

        return html`
            <div class="ui-flex-grid" style="border-bottom: ${borderBottom};">
                <span class="ui-flex-grid-row">
                    <span class="ui-flex-grid-item" style="--flex: 0;">
                        ${entry.year}/${m}/${d}
                    </span>

                    <span
                        class="ui-flex-grid-item"
                        style="--flex: 0; white-space: nowrap"
                    >
                        ${entry.shift?.name || ""}
                    </span>
                </span>

                ${note}
            </div>
        `; // TODO: Add a delete button for each entry(?)
    });

    return html`
        <ul>
            ${entryItems.join("")}
        </ul>
    `;
}
