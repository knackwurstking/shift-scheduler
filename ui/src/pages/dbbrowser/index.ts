import * as ui from "ui";

import { appBarUtils, db, html, searchUtils } from "@lib";
import { m } from "@paraglide/messages";

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    appBarTitleBackup = appBarUtils.getTitle();
    appBarUtils.setTitle("DB-Browser");

    setupAppBarButtons();

    const target = document.querySelector<HTMLElement>("#routerTarget")!;
    target.innerHTML = await getHTML();
    setupHTMLHandlers(
        target.querySelector(`.db-entry-item-container`)!,
        target.querySelector(`#dbbrowserSearchBar`)!,
    );
}

export async function onDestroy() {
    appBarUtils.setTitle(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

async function pageReRender() {
    await onDestroy();
    await onMount();
}

async function getHTML(): Promise<string> {
    const dbEntries = await db.getAll();

    let month: string, date: string, note: string;

    const entryItems: string[] = dbEntries.map((entry) => {
        month = (entry.month + 1).toString().padStart(2, "0");
        date = entry.date.toString().padStart(2, "0");

        note = "";
        if (entry.note) {
            note = html`<p class="ui-flex-item">${entry.note}</p>`;
        }

        return html`
            <div
                class="db-entry-item ui-flex column gap ui-border"
                data-year="${entry.year}"
                data-month="${entry.month}"
                data-date="${entry.date}"
            >
                <span class="ui-flex gap">
                    <span class="ui-flex-item" style="flex: 0;">
                        ${entry.year}/${month}/${date}
                    </span>

                    <span
                        class="ui-flex-item"
                        style="
                            flex: 0;
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
        <style>
            .db-entry-item {
                padding: var(--ui-spacing);
            }

            .db-entry-item.selected {
                background-color: var(--ui-secondary);
                color: var(--ui-secondary-text);
                border-radius: var(--ui-radius);
            }
        </style>

        <div class="ui-flex column gap" style="width: 100%; height: 100%">
            <div
                class="ui-flex-item"
                style="flex: 1; width: 100%; height: 100%; overflow: hidden;"
            >
                <div
                    class="db-entry-item-container ui-flex column gap ui-hide-scrollbar ui-auto-scroll-y"
                    style="width: 100%; min-height: 100%; max-height: 100%;"
                >
                    ${entryItems.join("")}
                </div>
            </div>

            <section class="search-bar" style="width: 100%;">
                <fieldset>
                    <legend>${m.dbbrowser_search_bar_title()}</legend>
                    <div class="search-bar">
                        <input
                            id="dbbrowserSearchBar"
                            style="width: 100%"
                            type="search"
                            placeholder="${m.dbbrowser_search_bar_input_placeholder()}"
                        />
                    </div>
                </fieldset>
            </section>
        </div>
    `;
}

function setupHTMLHandlers(
    itemContainer: HTMLElement,
    searchBar: HTMLInputElement,
) {
    const deadzone = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
    );

    let timeout: NodeJS.Timeout | null = null;
    let fastSelectionMode = false;
    let timeoutHandler: () => void;
    let entryItem: HTMLElement | null = null;
    let startX: number | null;
    let startY: number | null;

    itemContainer.onpointerdown = (ev) => {
        entryItem = (ev.target! as HTMLElement).closest<HTMLElement>(
            `.db-entry-item`,
        );
        if (entryItem === null) {
            return;
        }

        startX = ev.clientX;
        startY = ev.clientY;

        timeoutHandler = () => {
            if (!fastSelectionMode) {
                fastSelectionMode = true;
                enableFastSelectionMode(itemContainer, (mode) => {
                    fastSelectionMode = false;
                    disableFastSelectionMode();

                    if (mode === "delete") {
                        pageReRender();
                    }
                });
            }

            if (entryItem !== null) entryItem.classList.toggle("selected");

            if (checkForFastSelectionModeExit(itemContainer)) {
                fastSelectionMode = false;
                disableFastSelectionMode();
            }
        };

        if (fastSelectionMode) {
            timeoutHandler();
        } else {
            timeout = setTimeout(timeoutHandler, 250);
        }
    };

    itemContainer.onpointermove = (e) => {
        if (startX === null || startY === null) return;

        if (
            !!entryItem &&
            Math.abs(
                Math.max(e.clientX - startX, Math.abs(e.clientY - startY)),
            ) > deadzone
        ) {
            itemContainer.onpointerup!(e);
        }
    };

    itemContainer.onpointerup = () => {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }

        if (startX !== null || startY !== null) {
            startX = null;
            startY = null;
        }
    };

    itemContainer.onpointerleave = itemContainer.onpointerup;

    searchBar.oninput = () => {
        if (!searchBar.value) {
            itemContainer
                .querySelectorAll<HTMLElement>(`.db-entry-item`)
                .forEach((item) => {
                    item.style.display = "flex";
                });

            return;
        }

        const regex = searchUtils.generateRegExp(searchBar.value);

        itemContainer
            .querySelectorAll<HTMLElement>(`.db-entry-item`)
            .forEach((item) => {
                if (
                    !!item
                        .textContent!.replace(/(\n|\r|\s+)/g, " ")
                        .match(regex)
                ) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                    item.classList.remove("selected");
                }
            });
    };
}

function checkForFastSelectionModeExit(itemContainer: HTMLElement): boolean {
    for (const item of itemContainer.querySelectorAll(`.db-entry-item`)) {
        if (item.classList.contains("selected")) {
            return false;
        }
    }

    return true;
}

function enableFastSelectionMode(
    itemContainer: HTMLElement,
    cb: (mode: "delete" | "uncheck") => void,
) {
    const deleteButton = appBarUtils.get("delete");
    deleteButton.removeAttribute("disabled");
    deleteButton.onclick = async () => {
        let year: number, month: number, date: number;
        const promisesRunning: Promise<void>[] = [];

        let itemsToRemove: HTMLElement[] = [];
        itemContainer
            .querySelectorAll<HTMLElement>(`.db-entry-item`)
            .forEach((item) => {
                if (
                    item.classList.contains("selected") &&
                    item.style.display !== "none"
                ) {
                    itemsToRemove.push(item);
                }
            });

        if (
            !confirm(
                m.dbbrowser_delete_confirm({ count: itemsToRemove.length }),
            )
        ) {
            return;
        }

        itemsToRemove.forEach((item) => {
            item.remove();

            year = parseInt(item.getAttribute("data-year")!, 10);
            month = parseInt(item.getAttribute("data-month")!, 10);
            date = parseInt(item.getAttribute("data-date")!, 10);
            promisesRunning.push(db.delete(year, month, date));
        });

        for (const promise of promisesRunning) {
            await promise;
        }

        if (!!cb) cb("delete");
    };

    const checkButton = appBarUtils.get("check");
    checkButton.removeAttribute("disabled");
    checkButton.onclick = () => {
        itemContainer
            .querySelectorAll<HTMLElement>(`.db-entry-item`)
            .forEach((item) => {
                if (item.style.display !== "none") {
                    item.classList.add("selected");
                }
            });

        appBarUtils.disable(checkButton);
        appBarUtils.enable(uncheckButton);
    };

    const uncheckButton = appBarUtils.get("uncheck");
    uncheckButton.removeAttribute("disabled");
    uncheckButton.onclick = () => {
        itemContainer.querySelectorAll(`.db-entry-item`).forEach((item) => {
            item.classList.remove("selected");
        });

        appBarUtils.disable(uncheckButton);
        appBarUtils.enable(checkButton);

        if (!!cb) cb("uncheck");
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
    const checkButton = appBarUtils.enable("check");
    checkButton.setAttribute("disabled", "");
    checkButton.onclick = () => {
        appBarUtils.disable("uncheck");
    };

    const uncheckButton = appBarUtils.get("uncheck");
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
