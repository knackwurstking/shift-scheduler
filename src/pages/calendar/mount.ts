import * as ui from "ui";

import * as store from "../../store";
import * as utils from "../../utils";

import * as constants from "./constants";
import * as handlers from "./handlers";
import * as itemContent from "./item-content";
import * as lib from "./lib";

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = utils.appBar.get();
    utils.appBar.set("");

    const swipeHandler = new lib.SwipeHandler(
        document.querySelector(constants.query.itemContainer)!,
    );

    // Enable app-bar items
    setupAppBarItems();

    // Render day items
    renderDayItems();

    // Setup store handlers
    setupStoreHandlers();

    swipeHandler.addListener("swipe", handlers.swipe);
    cleanup.push(() => swipeHandler.removeListener("swipe", handlers.swipe));

    setTimeout(() => {
        swipeHandler.start();
    });
}

export async function onDestroy() {
    utils.appBar.set(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

function renderDayItems() {
    const date = new Date();

    Array.from(document.querySelector(constants.query.itemContainer)!.children)!.forEach((item) => {
        item.innerHTML = "";
        item.appendChild(itemContent.create(date.getFullYear(), date.getMonth()));
    });
}

function setupAppBarItems() {
    // TODO: ...
}

function setupStoreHandlers() {
    cleanup.push(
        store.obj.listen("date-picker", handlers.datePicker, true),
        store.obj.listen("edit-mode", handlers.editMode, true),
    );
}
