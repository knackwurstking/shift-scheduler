//import * as constants from "./constants";
import * as utils from "../../utils";
import * as store from "../../store";
import * as handlers from "./handlers";

let appBarTitleBackup = "";

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = utils.appBar.get();
    utils.appBar.set("");

    // Enable app-bar items
    setupAppBarItems();

    // TODO: Render day items

    // Setup store handlers
    setupStoreHandlers();
}

export async function onDestroy() {
    // Restore app bar title
    utils.appBar.set(appBarTitleBackup);
}

function setupAppBarItems() {
    // TODO: ...
}

function setupStoreHandlers() {
    store.obj.listen("date-picker", handlers.datePicker, true);
    store.obj.listen("week-start", handlers.weekStart, true);
    store.obj.listen("edit-mode", handlers.editMode, true);
}
