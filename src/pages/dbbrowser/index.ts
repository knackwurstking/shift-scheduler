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
    setupHTMLHandlers(target);
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

        // TODO: Add styles for .selected
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

    return html`
        <!-- TODO: Add filter bar to the bottom -->

        <ul>
            ${entryItems.join("")}
        </ul>
    `;
}

function setupHTMLHandlers(container: HTMLElement) {
    let timeout: NodeJS.Timeout | null = null;
    let fastSelectionMode = false;
    let timeoutHandler: () => void;

    container.onpointerdown = (ev) => {
        const entryItem = (ev.target! as HTMLElement).closest<HTMLElement>(
            `.db-entry-item`,
        );
        console.debug("entryItem:", entryItem);
        if (entryItem === null) {
            return;
        }

        timeoutHandler = () => {
            if (!fastSelectionMode) {
                fastSelectionMode = true;
                enableFastSelectionMode(container, () => {
                    fastSelectionMode = false;
                    disableFastSelectionMode();
                });
            }

            entryItem.classList.toggle("selected");

            if (checkForFastSelectionModeExit(container)) {
                fastSelectionMode = false;
                disableFastSelectionMode();
            }
        };

        if (fastSelectionMode) {
            timeoutHandler();
        } else {
            timeout = setTimeout(timeoutHandler, 500);
        }
    };

    container.onpointermove = (e) => {
        container.onpointercancel!(e);
    };

    container.onpointerleave =
        container.onpointercancel =
        container.onpointerup =
            () => {
                if (timeout !== null) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            };

    // TODO: Handler for the filter bar
}

function checkForFastSelectionModeExit(container: HTMLElement): boolean {
    for (const item of container.querySelectorAll(`.db-entry-item`)) {
        if (item.classList.contains("selected")) {
            return false;
        }
    }

    return true;
}

function enableFastSelectionMode(container: HTMLElement, cb: () => void) {
    const deleteButton = appBarUtils.get("delete");
    deleteButton.removeAttribute("disabled");
    deleteButton.onclick = () => {
        container.querySelectorAll(`.db-entry-item`).forEach((item) => {
            if (item.classList.contains("selected")) item.remove();
        });

        if (!!cb) cb();
    };

    const checkButton = appBarUtils.get("check");
    checkButton.removeAttribute("disabled");
    checkButton.onclick = () => {
        container.querySelectorAll(`.db-entry-item`).forEach((item) => {
            item.classList.add("selected");
        });
    };

    const uncheckButton = appBarUtils.get("uncheck");
    uncheckButton.removeAttribute("disabled");
    uncheckButton.onclick = () => {
        container.querySelectorAll(`.db-entry-item`).forEach((item) => {
            item.classList.remove("selected");
        });

        if (!!cb) cb();
    };
}

function disableFastSelectionMode() {
    const deleteButton = appBarUtils.get("delete");
    deleteButton.setAttribute("disabled", "");

    const checkButton = appBarUtils.get("check");
    checkButton.setAttribute("disabled", "");

    const uncheckButton = appBarUtils.get("uncheck");
    uncheckButton.setAttribute("disabled", "");
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
