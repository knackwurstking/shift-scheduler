// TODO: Continue here...
import * as ui from "ui";

import { appBarUtils, html } from "@lib";

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    appBarTitleBackup = appBarUtils.getTitle();
    appBarUtils.setTitle("DB-Browser");

    document.querySelector("#routerTarget")!.innerHTML = getHTML();

    // ...
}

export async function onDestroy() {
    appBarUtils.setTitle(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

function getHTML(): string {
    return html``; // ...
}
