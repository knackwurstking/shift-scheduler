import ui from "ui";
import * as utils from "./utils";

export const eventDatePickerChange = "datepickerchange";

/**
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").IconButton} IconButton
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
 */

export class App extends ui.events.Events {
    /** @type {import("ui/src/wc").Lang} */
    #lang

    /**
     * @param {import("ui/src/wc").Store} store
     */
    constructor(store) {
        super();

        /** @type {(() => void)[]} */
        this.cleanup = [];

        this.store = store;
        /** @type {import("ui/src/wc").Lang} */
        this.#lang = document.querySelector("ui-lang")

        /** @type {import("ui/src/wc/theme-handler").ThemeHandler} */
        this.themeHandler = document.querySelector("#themeHandler");

        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");
        this.#registerPages();

        // App Bar
        this.appBar = {
            // left slot
            /** @type {IconButton} */
            backButton: document.querySelector("#appBarBackButton"),
            /** @type {Button} */
            datePickerButton: document.querySelector("#appBarDatePickerButton"),

            // AppBar right slot
            /** @type {IconButton} */
            editButton: document.querySelector("#appBarEditButton"),
            /** @type {IconButton} */
            todayButton: document.querySelector("#appBarTodayButton"),
            /** @type {IconButton} */
            pdfButton: document.querySelector("#appBarPDFButton"),
            /** @type {IconButton} */
            settingsButton: document.querySelector("#appBarSettingsButton"),
        };

        this.appBar.backButton.onclick = async () => this.stackLayout.goBack();
        this.appBar.datePickerButton.onclick = async () => null; // TODO: Add date-picker onclick callback

        this.appBar.editButton.onclick = async () => null; // TODO: Add edit onclick callback
        this.appBar.todayButton.onclick = async () => this.setMonth(new Date());
        this.appBar.pdfButton.onclick = async () =>
            this.stackLayout.setPage("pdf");
        this.appBar.settingsButton.onclick = async () =>
            this.stackLayout.setPage("settings");
    }

    onMount() {
        this.cleanup.push(
            this.store.data.on(
                "theme",
                (/**@type{import("./types").ThemeStore}*/ data) => {
                    console.log(`[app] current theme in use:`, data)
                    utils.setTheme(data, this.themeHandler);
                },
                true,
            ),
            this.stackLayout.events.addListener(
                "change",
                this.#onStackLayoutChange.bind(this),
            ),
        );
    }

    onDestroy() {
        this.cleanup.forEach((callback) => callback());
        this.cleanup = []
    }

    run() {
        // Set the initial month for the calendar page
        this.setMonth(new Date());

        this.stackLayout.setPage("calendar");
    }

    getMonth() {
        let [year, month] = this.appBar.datePickerButton.innerText.split("/");

        if (!year || !month) throw `the date-picker button contains no date!`;

        if (isNaN(Number(year)) || isNaN(Number(month)))
            throw `the date-picker button contains no date!`;

        return new Date(Number(year), Number(month) - 1, 1);
    }

    /** @param {Date} date */
    setMonth(date) {
        this.appBar.datePickerButton.innerText = this.getMonthString(date);
        this.dispatchWithData(eventDatePickerChange, date);
    }

    /** @param {Date} date */
    getMonthString(date) {
        return `${date.getFullYear()} / ${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    }

    goNextMonth() {
        const date = this.getMonth();
        date.setMonth(date.getMonth() + 1);
        this.setMonth(date);
    }

    goPrevMonth() {
        const date = this.getMonth();
        date.setMonth(date.getMonth() - 1);
        this.setMonth(date);
    }

    #registerPages() {
        this.stackLayout.registerPage("calendar", () => {
            return document.querySelector("template#pageCalendar")
                // @ts-expect-error
                .content.cloneNode(true);
        });

        this.stackLayout.registerPage("pdf", () => {
            return document.querySelector("template#pagePDF")
                // @ts-expect-error
                .content.cloneNode(true)
        });

        this.stackLayout.registerPage("settings", () => {
            return document.querySelector("template#pageSettings")
                // @ts-expect-error
                .content.cloneNode(true)
        });
    }

    /** @param {import("ui/src/wc").StackLayoutPage | null} page */
    async #onStackLayoutChange(page) {
        console.log(`[app] stack layout changed:`, page)

        // Update the AppBar buttons...
        if (this.stackLayout.stack.length <= 1) {
            // NOTE: Need to grep the parent of the item element here
            this.appBar.backButtonParent = this.appBar.backButton.parentElement.parentElement
            this.appBar.backButtonParent.removeChild(this.appBar.backButton.parentElement)
        } else {
            this.appBar.backButtonParent.insertBefore(this.appBar.backButton.parentElement, this.appBar.backButtonParent.children[0])
        }

        if (!page) {
            utils.setAppBarTitle("")
            this.#noPageSetup();
        }

        switch (page.name) {
            case "calendar":
                utils.setAppBarTitle("")
                this.#calendarPageSetup();
                break;
            case "settings":
                utils.setAppBarTitle(this.#lang.data.get("settings", "appBarTitle"))
                this.#settingsPageSetup();
                break;
            case "pdf":
                utils.setAppBarTitle("@TODO: PDF Page")
                this.#pdfPageSetup();
                break;
            default:
                throw `unknown page "${page.name}"`;
        }
    }

    #noPageSetup() {
        this.appBar.datePickerButton.style.display = "none";
        this.appBar.editButton.style.display = "none";
        this.appBar.todayButton.style.display = "none";
        this.appBar.pdfButton.style.display = "none";
        this.appBar.settingsButton.style.display = "none";
    }

    #calendarPageSetup() {
        this.appBar.datePickerButton.style.display = "flex";
        this.appBar.editButton.style.display = "flex";
        this.appBar.todayButton.style.display = "flex";
        this.appBar.pdfButton.style.display = "flex";
        this.appBar.settingsButton.style.display = "flex";
    }

    #settingsPageSetup() {
        this.appBar.datePickerButton.style.display = "none";
        this.appBar.editButton.style.display = "none";
        this.appBar.todayButton.style.display = "none";
        this.appBar.pdfButton.style.display = "none";
        this.appBar.settingsButton.style.display = "none";
    }

    #pdfPageSetup() {
        this.appBar.datePickerButton.style.display = "none";
        this.appBar.editButton.style.display = "none";
        this.appBar.todayButton.style.display = "none";
        this.appBar.pdfButton.style.display = "none";
        this.appBar.settingsButton.style.display = "none";
    }
}
