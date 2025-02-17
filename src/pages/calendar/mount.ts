import * as ui from "ui";

import * as dialogs from "../../dialogs";
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
        constants.query.appBar.left.datePicker,
    )!;

    const todayButton = document.querySelector<HTMLButtonElement>(
        constants.query.appBar.right.today,
    )!;

    const editButton = document.querySelector<HTMLButtonElement>(
        constants.query.appBar.right.edit,
    )!;

    const printerButton = document.querySelector<HTMLButtonElement>(
        constants.query.appBar.right.printer,
    )!;

    const settingsButton = document.querySelector<HTMLButtonElement>(
        constants.query.appBar.right.settings,
    )!;

    datePickerButton.style.display = "inline-flex";
    todayButton.style.display = "inline-flex";
    editButton.style.display = "inline-flex";
    printerButton.style.display = "inline-flex";
    settingsButton.style.display = "inline-flex";

    // date-picker handler
    datePickerButton.onclick = async () => {
        const data = await dialogs.datePicker.open(store.obj.get("date-picker")!);
        if (!data) return;

        store.obj.set("date-picker", data.date);
    };

    // today handler
    todayButton.onclick = async () => {
        store.obj.set("date-picker", new Date().getTime());
    };

    // TODO: Setup "edit" and "printer" handlers

    // handle today [disabled] attribute
    cleanup.push(
        store.obj.listen(
            "date-picker",
            (data) => {
                const today = new Date();
                const currentDate = new Date(data);
                const currentYear = currentDate.getFullYear();

                // Enable/Disable the app-bar "today" button
                if (
                    currentYear === today.getFullYear() &&
                    currentDate.getMonth() === today.getMonth()
                ) {
                    todayButton.setAttribute("disabled", "");
                } else {
                    todayButton.removeAttribute("disabled");
                }

                // Update date-picker button innerText content `YYYY / MM`?
                const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
                datePickerButton.innerText = `${currentYear} / ${currentMonth}`;
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
