import * as ui from "ui";

import * as utils from "../../utils";

import * as constants from "./constants";

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = utils.appBar.get();
    utils.appBar.set("");

    // TODO: ...
}

export async function onDestroy() {
    utils.appBar.set(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}
