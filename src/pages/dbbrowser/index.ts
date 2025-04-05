import * as ui from "ui";

import { appBarUtils, db, html } from "@lib";

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    appBarTitleBackup = appBarUtils.getTitle();
    appBarUtils.setTitle("DB-Browser");

    document.querySelector("#routerTarget")!.innerHTML = await getHTML();

    // ...
}

export async function onDestroy() {
    appBarUtils.setTitle(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

async function getHTML(): Promise<string> {
    // TODO: Generate a list with all indexed db entries for each day and a
    //       search bar to the bottom (or top?)
    const entryItems: string[] = (await db.getAll()).map((entry) => {
        return html`
            <div class="ui-flex-grid ui-debug">
                <span class="ui-flex-grid-row">
                    <span class="ui-flex-grid-item" style="text-align: center;">
                        ${entry.year}
                    </span>

                    <span class="ui-flex-grid-item" style="text-align: center;">
                        ${(entry.month + 1).toString().padStart(2, "0")}
                    </span>

                    <span class="ui-flex-grid-item" style="text-align: center;">
                        ${entry.date.toString().padStart(2, "0")}
                    </span>
                </span>

                <!-- TODO: The shift (short name) if changed (not null) -->

                <!-- TODO: Note if any -->
            </div>
        `; // TODO: ...
    });

    return html`
        <ul>
            ${entryItems.join("")}
        </ul>
    `;
}
