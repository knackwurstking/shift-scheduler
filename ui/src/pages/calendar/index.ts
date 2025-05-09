import * as ui from "ui";

import { dialogs } from "@components";
import { appBarUtils, html, store } from "@lib";

import * as handlers from "./handlers";
import { createItemContent } from "./item-content";
import { SwipeHandler } from "./swipe-handler";

const template = document.createElement("template");
template.innerHTML = html`
    <style>
        html,
        body {
            overscroll-behavior: none !important;
        }

        #routerTarget .item-container {
            --week-days-height: 2.5rem;
            --edit-mode-height: 4.5rem;

            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100%;
            transition: height 0.25s ease;
        }

        #routerTarget .item-container[edit-mode] {
            height: calc(100% - var(--edit-mode-height));
        }

        #routerTarget .edit-mode {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height: var(--edit-mode-height);
            transform: translateY(100%);
            transition: transform 0.25s ease;
        }

        #routerTarget .edit-mode[open] {
            transform: translateY(0);
        }

        #routerTarget .item {
            position: absolute;
            top: 0;
            bottom: 0;
            min-width: 100%;
        }

        #routerTarget .item-content {
            width: calc(100% - 0.25rem);
            height: calc(100% - 0.25rem);
        }

        #routerTarget .week-days {
            height: var(--week-days-height);
            padding: 1px 0;
        }

        #routerTarget .days {
            height: 100%;
            padding: 1px 0;
        }

        #routerTarget .week-day,
        #routerTarget .day {
            border-radius: var(--ui-radius);
            border: var(--ui-border-width) var(--ui-border-style)
                var(--ui-border-color);
        }

        #routerTarget .item-container[no-border] .week-days,
        #routerTarget .item-container[no-border] .days {
            border: none;
        }

        #routerTarget .week-day {
            width: calc(100% / 7);
            overflow: hidden;
            height: 100%;
            font-size: 4vmin;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #routerTarget .week-day.saturday,
        #routerTarget .week-day.sunday {
            --wght: 800;
        }

        #routerTarget .day {
            height: 100%;
            overflow: hidden;
            cursor: pointer;
        }

        #routerTarget .day .bi {
            display: none;
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 3.5vmin;
        }

        #routerTarget .day.note .bi {
            display: inline-block;
        }

        #routerTarget .day .date {
            z-index: 1;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0.5vmin;
            font-size: 3vmin;
            font-size: clamp(0rem, 3vmin, 1rem);
            border-radius: inherit;
        }

        #routerTarget .day.today .date {
            --wght: 950;
            text-decoration: underline;
        }

        #routerTarget .day .shift {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 5vmin;
            font-weight: bold;
            color: var(--shift-color, inherit);
            border-radius: inherit;
        }

        #routerTarget .day.color-switch {
            background-color: var(--shift-color, inherit);
            color: black;
        }

        #routerTarget .day.color-switch .shift {
            color: inherit;
        }

        @media (orientation: landscape) {
            #routerTarget .day .shift {
                left: 4vmin;
            }
        }

        @media (orientation: portrait) {
            #routerTarget .day .shift {
                top: 5vmin;
            }
        }

        @keyframes fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        #routerTarget .shift-card[active] {
            border-color: var(--ui-text);
        }
    </style>

    <div class="item-container ui-flex gap ui-none-select">
        <div class="item item1" style="left: -100%"></div>

        <div class="item item2" style="left: 0"></div>

        <div class="item item3" style="left: 100%"></div>
    </div>

    <div class="edit-mode ui-flex gap ui-auto-scroll-x ui-hide-scrollbar"></div>
`;

let appBarTitleBackup = "";
let cleanup: ui.CleanUpFunction[] = [];

export async function onMount() {
    // Setup app bar
    appBarTitleBackup = appBarUtils.getTitle();
    appBarUtils.setTitle("");

    const routerTarget = document.querySelector<HTMLElement>(`#routerTarget`)!;
    routerTarget.innerHTML = "";
    routerTarget.appendChild(template.content.cloneNode(true));

    const swipeHandler = new SwipeHandler(
        document.querySelector(`.item-container`)!,
    );

    // Enable app-bar items
    setupAppBarItems();

    // Render
    render();

    // Setup store handlers
    cleanup.push(
        store.obj.listen("datePicker", handlers.datePicker, true),
        store.obj.listen("editMode", handlers.editMode, true),
    );

    const onFocus = () => {
        const todayItem = routerTarget.querySelector(`.day.today`);
        if (todayItem) {
            const y = parseInt(todayItem.getAttribute("data-year")!, 10);
            const m = parseInt(todayItem.getAttribute("data-month")!, 10);
            const d = parseInt(todayItem.getAttribute("data-date")!, 10);
            const nD = new Date();
            if (
                y !== nD.getFullYear() ||
                m !== nD.getMonth() ||
                d !== nD.getDate()
            ) {
                const newTodayItem = routerTarget.querySelector(
                    `[data-year="${nD.getFullYear()}"][data-month="${nD.getMonth()}"][data-date="${nD.getDate()}"]`,
                );
                if (newTodayItem) {
                    todayItem.classList.remove("today");
                    newTodayItem.classList.add("today");
                }
            }
        }
    };
    window.addEventListener("focus", onFocus);
    cleanup.push(() => {
        window.removeEventListener("focus", onFocus);
    });

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
    appBarUtils.setTitle(appBarTitleBackup);
    cleanup.forEach((fn) => fn());
    cleanup = [];
}

function render() {
    // Create content for items in "item-container"
    const date = new Date();

    Array.from(document.querySelector(`.item-container`)!.children)!.forEach(
        (item) => {
            item.innerHTML = "";
            item.appendChild(
                createItemContent(date.getFullYear(), date.getMonth()),
            );
        },
    );
}

function setupAppBarItems() {
    const datePickerButton = appBarUtils.enable("date-picker");
    const todayButton = appBarUtils.enable("today");
    appBarUtils.enable("settings");

    datePickerButton.onclick = async () => {
        const data = await dialogs.datePicker.open(
            store.obj.get("datePicker")!,
        );
        if (!data) return;

        store.obj.set("datePicker", data.date);
    };

    todayButton.onclick = async () => {
        const today = new Date();
        store.obj.set(
            "datePicker",
            new Date(today.getFullYear(), today.getMonth()).getTime(),
        );
    };

    appBarUtils.enable("edit").onclick = async () => {
        store.obj.update("editMode", (data) => {
            data.open = !data.open;
            return data;
        });
    };

    appBarUtils.enable("printer").onclick = async () => {
        await dialogs.calendarPrint.open(
            new Date(store.obj.get("datePicker")!).getFullYear(),
        );
    };

    // Disable or enable today button based on date-picker
    cleanup.push(
        store.obj.listen(
            "datePicker",
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
                const currentMonth = (currentDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                datePickerButton.innerText = `${currentYear} / ${currentMonth}`;
            },
            true,
        ),
    );

    cleanup.push(() => {
        appBarUtils.disable("date-picker");
        appBarUtils.disable("today");
        appBarUtils.disable("edit");
        appBarUtils.disable("printer");
        appBarUtils.disable("settings");
    });
}
