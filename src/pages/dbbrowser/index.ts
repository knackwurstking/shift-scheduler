import * as ui from "ui";

import { appBarUtils, db, html } from "@lib";

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    appBarTitleBackup = appBarUtils.getTitle();
    appBarUtils.setTitle("DB-Browser");

    setupAppBarButtons();

    const target = document.querySelector<HTMLElement>("#routerTarget")!;
    target.innerHTML = await getHTML();
    setHTMLHandlers(target);
}

export async function onDestroy() {
    appBarUtils.setTitle(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

async function getHTML(): Promise<string> {
    const dbEntries = await db.getAll();
    const lastIndex = dbEntries.length - 1;

    let m: string, d: string, note: string, borderBottom: string;

    const entryItems: string[] = dbEntries.map((entry, i) => {
        m = (entry.month + 1).toString().padStart(2, "0");
        d = entry.date.toString().padStart(2, "0");

        note = "";
        if (entry.note) {
            note = html`<p class="ui-flex-grid-item">${entry.note}</p>`;
        }

        borderBottom = "none";
        if (i !== lastIndex) {
            borderBottom =
                "var(--ui-border-width) var(--ui-border-style) var(--ui-border-color)";
        }

        return html`
            <div
                class="db-entry-item ui-flex-grid"
                style="border-bottom: ${borderBottom};"
            >
                <span class="ui-flex-grid-row">
                    <span class="ui-flex-grid-item" style="--flex: 0;">
                        ${entry.year}/${m}/${d}
                    </span>

                    <span
                        class="ui-flex-grid-item"
                        style="
                            --flex: 0;
                            white-space: nowrap;
                            color: ${entry.shift?.color || "inherit"};
                        "
                    >
                        ${entry.shift?.name || ""}
                    </span>
                </span>

                ${note}
            </div>
        `;
    });

    // TODO: Add filter bar to the bottom
    return html`
        <ul>
            ${entryItems.join("")}
        </ul>
    `;
}

async function setHTMLHandlers(el: HTMLElement) {
    const ul = el.querySelector("ul")!;

    ul.onpointerdown = () => {
        // TODO: Add click listener for touch hold => select item and enter the
        //       fast selection mode until nothing is selected anymore.
        //       Allow select/deselect all and delete
    };

    ul.onpointerleave =
        ul.onpointercancel =
        ul.onpointerup =
            () => {
                // TODO: Cancel the pointerdown event handler here
            };

    // TODO: Handler the filter bar
}

function setupAppBarButtons() {
    // Enable the back button (app-bar)
    const backButton = appBarUtils.enable("back");
    const backupBackButtonCB = backButton.onclick;
    backButton.onclick = () => ui.router.hash.goTo(null, "settings");

    // Enable select all button (app-bar)
    const checkButton = appBarUtils.get("check");
    checkButton.onclick = () => {
        appBarUtils.disable("uncheck");
    };

    const uncheckButton = appBarUtils.enable("uncheck");
    uncheckButton.setAttribute("disabled", "");
    uncheckButton.onclick = () => {
        appBarUtils.disable("check");
    };

    // Enable delete button (app-bar)
    const deleteButton = appBarUtils.enable("delete");
    deleteButton.setAttribute("disabled", "");

    cleanup.push(() => {
        appBarUtils.disable(backButton).onclick = backupBackButtonCB;
        appBarUtils.disable(checkButton);
        appBarUtils.disable(uncheckButton);
        appBarUtils.disable(deleteButton);
    });
}
