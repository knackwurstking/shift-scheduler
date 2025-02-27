import * as ui from "ui";

import * as dialogs from "../../dialogs";
import * as store from "../../lib/store";
import * as utils from "../../lib/utils";

const html = String.raw;

const template = document.createElement("template");
template.innerHTML = html`
    <article class="misc">
        <h4>Miscellaneous</h4>

        <section class="week-start">
            <label class="ui-flex justify-between" style="padding: var(--ui-spacing);">
                The week starts on Monday
                <input type="checkbox" />
            </label>
        </section>
    </article>

    <br />

    <article class="shifts">
        <h4>Shift Settings</h4>

        <section class="shifts-table ui-flex-grid">
            <table class="ui-flex-grid-item">
                <thead>
                    <tr>
                        <th style="text-align: left;">Name</th>
                        <th style="text-align: left;">Short</th>
                        <th style="text-align: right;"></th>
                    </tr>
                </thead>

                <tbody></tbody>
            </table>

            <div
                class="ui-flex-grid-item ui-flex justify-end"
                style="padding: var(--ui-spacing); width: 100%;"
            >
                <button>Add a new shift</button>
            </div>

            <template name="table-item">
                <tr class="item" data-json="">
                    <td class="name" style="text-align: left;"></td>

                    <td class="short-name" style="text-align: left; color: inherit"></td>

                    <td class="actions" style="text-align: right;">
                        <div class="ui-flex-grid-row" style="--justify: flex-end;">
                            <div class="ui-flex-grid-item" style="--flex: 0;">
                                <button class="edit" variant="ghost" icon>
                                    <i class="bi bi-pen"></i>
                                </button>
                            </div>

                            <div class="ui-flex-grid-item" style="--flex: 0;">
                                <button class="delete" variant="ghost" icon>
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            </template>
        </section>

        <section class="start-date">
            <label class="ui-flex justify-between align-center" style="padding: var(--ui-spacing);">
                Start Date
                <input type="date" />
            </label>
        </section>

        <section class="edit-rhythm">
            <label class="ui-flex justify-between align-center" style="padding: var(--ui-spacing)">
                Rhythm
                <button>Edit</button>
            </label>
        </section>
    </article>

    <br />

    <article class="backup">
        <h4>Backup</h4>

        <section class="json-file">
            <label class="ui-flex justify-between align-center" style="padding: var(--ui-spacing)">
                Backup to JSON
                <span class="ui-flex gap" style="--justify: flex-end;">
                    <button class="import" color="secondary">Import</button>
                    <button class="export" color="secondary">Export</button>
                </span>
            </label>
        </section>
    </article>

    <br />

    <article class="db-browser">
        <h4>IndexedDB</h4>

        <section>
            <label class="ui-flex justify-between align-center" style="padding: var(--ui-spacing)">
                Edit entries
                <button>Browse</button>
            </label>
        </section>
    </article>
`;

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = utils.appBar.get();
    utils.appBar.set("Settings");

    const routerTarget = document.querySelector<HTMLElement>(`#routerTarget`)!;
    routerTarget.innerHTML = "";
    routerTarget.appendChild(template.content.cloneNode(true));

    setupAppBarItems();

    render(routerTarget);
}

export async function onDestroy() {
    utils.appBar.set(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

function setupAppBarItems() {
    const back = document.querySelector<HTMLButtonElement>(`.ui-app-bar .left .back`)!;

    back.style.display = "inline-flex";

    cleanup.push(() => {
        back.style.display = "none";
    });
}

function render(target: HTMLElement): void {
    renderMisc(target);
    renderShifts(target);
    renderBackup();
    renderDBBrowser();
}

function renderMisc(target: HTMLElement): void {
    const weekStart = target.querySelector<HTMLInputElement>(
        `article.misc section.week-start input[type="checkbox"]`,
    )!;

    // Read week start from store
    weekStart.checked = store.obj.get("week-start") === 1;

    // Update store on change
    weekStart.onchange = () => {
        store.obj.set("week-start", weekStart.checked ? 1 : 0);
    };
}

function renderShifts(target: HTMLElement) {
    const tbody = target.querySelector<HTMLElement>(`article.shifts section.shifts-table tbody`)!;
    const template = document.querySelector<HTMLTemplateElement>(
        `article.shifts section.shifts-table template.table-item`,
    )!;

    // Create shift table rows from settings shifts
    store.obj.get("settings")!.shifts.forEach((shift) => {
        const tableItem = (
            template.content.cloneNode(true) as HTMLElement
        ).querySelector<HTMLElement>(`tr.item`)!;

        tbody.appendChild(tableItem);

        // Set shift name
        tableItem.querySelector<HTMLElement>(`.name`)!.innerText = shift.name;

        // Set shifts short name
        const shortName = tableItem.querySelector<HTMLElement>(`.short-name`)!;
        shortName.style.color = shift.color || "inherit";
        shortName.innerText = shift.visible ? shift.shortName : "";

        // Set edit button handler, open edit dialog
        const editButton = tableItem.querySelector<HTMLElement>(`button.edit`)!;
        editButton.onclick = async () => {
            const data = await dialogs.shift.open(shift);
            if (!data) {
                return;
            }

            // Update store and and table item
            store.obj.update("settings", (settings) => {
                return {
                    ...settings,
                    shifts: settings.shifts.map((s) => {
                        if (s.id === shift.id) {
                            return shift;
                        }

                        return s;
                    }),
                };
            });
        };

        const deleteButton = tableItem.querySelector<HTMLElement>(`button.delete`)!;
        deleteButton.onclick = async () => {
            if (confirm(`Delete shift \"${shift.name}\"?`)) {
                store.obj.update("settings", (data) => {
                    return {
                        ...data,
                        shifts: data.shifts.filter((s) => s.id !== shift.id),
                    };
                });
            }
        };
    });

    const startDate = target.querySelector<HTMLInputElement>(
        `article.shifts section.start-date input[type="date"]`,
    )!;

    // TODO: ...

    const editRhythm = target.querySelector<HTMLButtonElement>(
        `article.shifts section.edit-rhythm button`,
    )!;

    // TODO: ...
}

function renderBackup() {
    // TODO: ...
}

function renderDBBrowser() {
    // TODO: ...
}
