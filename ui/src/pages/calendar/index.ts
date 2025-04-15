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
            font-size: 115%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #routerTarget .saturday,
        #routerTarget .sunday {
            font-weight: bold;
        }

        #routerTarget .saturday,
        #routerTarget .sunday {
            background-color: var(--ui-muted);
            color: var(--ui-muted-text);
        }

        #routerTarget .day {
            height: 100%;
            overflow: hidden;
            cursor: pointer;
        }

        #routerTarget .day.today::after {
            content: "";
            position: absolute;
            z-index: 9;
            top: -1rem;
            left: -1rem;
            width: 2rem;
            height: 2rem;
            border-radius: var(--ui-radius);
            border-bottom-right-radius: 50%;
            background-color: orange;
            filter: blur(1rem);
            animation: fade-in 0.5s;
        }

        #routerTarget .day.note::before {
            content: "";
            position: absolute;
            z-index: 8;
            bottom: -1rem;
            right: -1rem;
            width: 2rem;
            height: 2rem;
            border-radius: var(--ui-radius);
            border-top-left-radius: 50%;
            background-color: red;
            filter: blur(1rem);
            animation: fade-in 0.5s;
        }

        #routerTarget .day .date {
            position: absolute;
            top: 0;
            left: 0;
            padding: 0.5vmin;
            font-size: 3vmin;
            font-size: clamp(0rem, 3vmin, 1rem);
            border-radius: inherit;
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
            color: var(--shift-color, var(--ui-text));
            border-radius: inherit;
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

    <div
        class="edit-mode ui-flex gap ui-auto-scroll-x ui-hide-scrollbar"
        style="--gap: 0.5rem"
    ></div>
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
