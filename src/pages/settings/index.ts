import * as ui from "ui";

import { appBar } from "@utils";

import * as render from "./render";

let appBarTitleBackup = "";
let appBarBackButtonBackup: any = null;

let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = appBar.get();
    appBar.set("Settings");

    const routerTarget = document.querySelector<HTMLElement>(`#routerTarget`)!;
    routerTarget.innerHTML = "";

    setupAppBarItems();

    routerTarget.appendChild(render.misc.article());
    routerTarget.appendChild(document.createElement("br"));

    routerTarget.appendChild(render.shifts.article());
    routerTarget.appendChild(document.createElement("br"));

    routerTarget.appendChild(render.backup.article(reload));
    routerTarget.appendChild(document.createElement("br"));

    routerTarget.appendChild(render.dbBrowser.article());
}

export async function onDestroy() {
    appBar.set(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

function setupAppBarItems() {
    const back = document.querySelector<HTMLButtonElement>(
        `.ui-app-bar .left .back`,
    )!;

    back.style.display = "inline-flex";

    appBarBackButtonBackup = back.onclick;
    back.onclick = () => ui.router.hash.goTo(null, "");

    cleanup.push(() => {
        back.style.display = "none";
        back.onclick = appBarBackButtonBackup;
    });
}

async function reload() {
    await onDestroy();
    await onMount();
}
