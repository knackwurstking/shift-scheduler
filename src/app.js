import ui from "ui";
import { DB } from "./lib";
import * as utils from "./utils";

export const eventDatePickerChange = "datepickerchange";

/**
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").IconButton} IconButton
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
 */

export class App extends ui.events.Events {
    /**
     * @param {import("ui/src/wc").Store} store
     */
    constructor(store) {
        super();

        this.store = store;

        /** @type {(() => void)[]} */
        this.cleanup = [];

        /** @type {import("ui/src/wc/theme-handler").ThemeHandler} */
        this.themeHandler = document.querySelector("#themeHandler");

        this.db;

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

            // AppBar center slot
            /** @type {HTMLElement} */
            title: document.querySelector("#appBarTitle"),

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
            ),
            this.stackLayout.events.addListener(
                "change",
                this.#onStackLayoutChange.bind(this),
            ),
        );

        if (!!this.db) this.db.close();
        this.db = new DB("shift-scheduler", 1); // TODO: Create some custom component?
    }

    onDestroy() {
        if (!!this.db) this.db.close();
        this.cleanup.forEach((callback) => callback());
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

    /**
     * @param {string} title
     */
    setTitle(title) {
        this.appBar.title.innerHTML = `<h3>${title}</h3>`;
    }

    #registerPages() {
        this.stackLayout.registerPage("calendar", () =>
            document
                .querySelector("template#pageCalendar")
                // @ts-ignore
                .content.cloneNode(true),
        );

        this.stackLayout.registerPage("pdf", () =>
            document
                .querySelector("template#pagePDF")
                // @ts-ignore
                .content.cloneNode(true),
        );

        this.stackLayout.registerPage("settings", () =>
            document
                .querySelector("template#pageSettings")
                // @ts-ignore
                .content.cloneNode(true),
        );
    }

    /** @param {import("ui/src/wc").StackLayoutPage | null} page */
    async #onStackLayoutChange(page) {
        // Setup back button
        if (this.stackLayout.stack.length <= 1) {
            this.appBar.backButton.style.display = "none";
        } else {
            this.appBar.backButton.style.display = "flex";
        }

        if (!page) {
            this.#noPageSetup();
        }

        switch (page.name) {
            case "calendar":
                // @ts-expect-error
                page.app = this;
                this.#calendarPageSetup(page);
                break;
            case "settings":
                // @ts-expect-error
                page.app = this;
                this.#settingsPageSetup(page);
                break;
            case "pdf":
                this.#pdfPageSetup(page);
                break;
            default:
                throw `unknown page "${page.name}"`;
        }
    }

    #noPageSetup() {
        this.setTitle("");
        this.appBar.datePickerButton.style.display = "none";
        this.appBar.editButton.style.display = "none";
        this.appBar.todayButton.style.display = "none";
        this.appBar.pdfButton.style.display = "none";
        this.appBar.settingsButton.style.display = "none";
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #calendarPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "");
        this.appBar.datePickerButton.style.display = "flex";
        this.appBar.editButton.style.display = "flex";
        this.appBar.todayButton.style.display = "flex";
        this.appBar.pdfButton.style.display = "flex";
        this.appBar.settingsButton.style.display = "flex";
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #settingsPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "");
        this.appBar.datePickerButton.style.display = "none";
        this.appBar.editButton.style.display = "none";
        this.appBar.todayButton.style.display = "none";
        this.appBar.pdfButton.style.display = "none";
        this.appBar.settingsButton.style.display = "none";
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #pdfPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "");
        this.appBar.datePickerButton.style.display = "none";
        this.appBar.editButton.style.display = "none";
        this.appBar.todayButton.style.display = "none";
        this.appBar.pdfButton.style.display = "none";
        this.appBar.settingsButton.style.display = "none";
    }
}
