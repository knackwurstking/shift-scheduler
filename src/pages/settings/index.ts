import * as ui from "ui";

import * as utils from "../../lib/utils";

const html = String.raw;

const template = document.createElement("template");
template.innerHTML = html`
    <style>
        #routerTarget section.week-start > label {
            padding: var(--ui-spacing);
        }
    </style>

    <!-- MARK: Settings Page Template -->
    <article class="misc" open>
        <h4>Miscellaneous</h4>

        <section class="week-start">
            <label class="ui-flex justify-between">
                The week starts on Monday
                <input type="checkbox" />
            </label>
        </section>
    </article>

    <article class="shifts" open>
        <h4>Shift Settings</h4>

        <!-- TODO: Continue here -->
    </article>

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
