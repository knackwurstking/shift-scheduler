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

    setTimeout(() => {
        swipeHandler.start();
    });

    swipeHandler.addListener("swipe", handlers.swipe);
    cleanup.push(() => {
        swipeHandler.removeListener("swipe", handlers.swipe);
        swipeHandler.stop();
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
    const datePickerButton = document.querySelector<HTMLButtonElement>(
        `.ui-app-bar .left button.date-picker`,
    )!;
    const todayButton = document.querySelector<HTMLButtonElement>(
        `.ui-app-bar .right button.today`,
    )!;
    const editButton = document.querySelector<HTMLButtonElement>(`.ui-app-bar .right button.edit`)!;
    const printerButton = document.querySelector<HTMLButtonElement>(
        `.ui-app-bar .right button.printer`,
    )!;
    const settingsButton = document.querySelector<HTMLButtonElement>(
        `.ui-app-bar .right button.settings`,
    )!;

    datePickerButton.style.display = "inline-flex";
    todayButton.style.display = "inline-flex";
    editButton.style.display = "inline-flex";
    printerButton.style.display = "inline-flex";
    settingsButton.style.display = "inline-flex";

    // date-picker handler
    datePickerButton.onclick = async () => {
        // TODO: Open the date picker dialog and update "date-picker" store on submit
    };

    // today handler
    todayButton.onclick = async () => {
        store.obj.update("date-picker", () => {
            return new Date().getTime();
        });
    };

    // TODO: Setup "edit" and "printer" handlers

    // handle today [disabled] attribute
    cleanup.push(
        store.obj.listen(
            "date-picker",
            (data) => {
                const today = new Date();
                const date = new Date(data);

                if (
                    date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth()
                ) {
                    todayButton.setAttribute("disabled", "");
                } else {
                    todayButton.removeAttribute("disabled");
                }
            },
            true,
        ),
    );

    cleanup.push(() => {
        datePickerButton.style.display = "none";
        todayButton.style.display = "none";
        editButton.style.display = "none";
        printerButton.style.display = "none";
        settingsButton.style.display = "none";
    });
}

function setupStoreHandlers() {
    cleanup.push(
        store.obj.listen("date-picker", handlers.datePicker, true),
        store.obj.listen("edit-mode", handlers.editMode, true),
    );
}
