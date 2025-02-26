import * as ui from "ui";

import * as utils from "../../lib/utils";

const html = String.raw;

const template = document.createElement("template");
template.innerHTML = html`
    <!-- MARK: Settings Page Template -->
    <details class="misc" open>
        <summary>Miscellaneous</summary>

        <section class="week-start">
            <label>
                The week starts on Monday
                <input type="checkbox" />
            </label>
        </section>
    </details>

    <details class="shifts" open>
        <summary>Shift Settings</summary>

        <!-- TODO: Continue here -->
    </details>

    <!-- TODO: ... -->
`;

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = utils.appBar.get();
    utils.appBar.set("");

    const routerTarget = document.querySelector<HTMLElement>(`#routerTarget`)!;
    routerTarget.innerHTML = "";
    routerTarget.appendChild(template.content.cloneNode(true));

    // TODO: ...
}

export async function onDestroy() {
    utils.appBar.set(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}
