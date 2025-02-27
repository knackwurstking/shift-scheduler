import * as ui from "ui";

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

                    <td class="shift-short" style="text-align: left; color: inherit"></td>

                    <td class="actions" style="text-align: right;">
                        <div class="ui-flex-grid-row" style="--justify: flex-end;">
                            <div class="ui-flex-grid-item" style="--flex: 0;">
                                <button class="pen" variant="ghost" icon>
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

        <section class="backup">
            <label class="ui-flex justify-between align-center" style="padding: var(--ui-spacing)">
                Backup
                <span class="ui-flex-grid-row" style="--justify: flex-end;">
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

    // TODO: Enable back button
    setupAppBarItems();
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
