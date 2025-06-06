import * as ui from "ui";

import { appBarUtils } from "@lib";
import { m } from "@paraglide/messages";

import * as render from "./render";

let appBarTitleBackup = "";

let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = appBarUtils.getTitle();
    appBarUtils.setTitle(m.settings());

    const routerTarget = document.querySelector<HTMLElement>(`#routerTarget`)!;
    routerTarget.innerHTML = "";

    setupAppBarItems();

    if (!process.env.MODE) {
        routerTarget.appendChild(render.update.create());
        routerTarget.appendChild(document.createElement("br"));
    }

    routerTarget.appendChild(render.misc.create());
    routerTarget.appendChild(document.createElement("br"));

    routerTarget.appendChild(render.shifts.create());
    routerTarget.appendChild(document.createElement("br"));

    routerTarget.appendChild(render.theme.create());
    routerTarget.appendChild(document.createElement("br"));

    routerTarget.appendChild(render.backup.create(reload));
    routerTarget.appendChild(document.createElement("br"));

    routerTarget.appendChild(render.dbBrowser.create());
}

export async function onDestroy() {
    appBarUtils.setTitle(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

function setupAppBarItems() {
    const back = appBarUtils.enable("back");
    const backupBackButtonCB = back.onclick;
    back.onclick = () => ui.router.hash.goTo(null, "");

    cleanup.push(() => {
        appBarUtils.disable("back").onclick = backupBackButtonCB;
    });
}

async function reload() {
    await onDestroy();
    await onMount();
}
