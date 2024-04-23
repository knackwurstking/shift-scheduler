import ui from "ui";
import { DB, Language } from "./lib";
import * as utils from "./utils";

export const eventDatePickerChange = "datepickerchange";

/**
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").IconButton} IconButton
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
 */

export class App extends ui.events.Events {
    /** @param {import("ui/src/wc").StackLayoutPage | null} page */
    #onStackLayoutChange = async (page) => {
        // Setup back button
        if (this.stackLayout.stack.length <= 1) {
            this.backButton.style.display = "none";
        } else {
            this.backButton.style.display = "flex";
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
    };

    /**
     * @param {Element} app
     * @param {import("ui/src/wc").Store} store
     */
    constructor(app, store) {
        super(store.get("debug-mode")); // NOTE: Events: `eventDatePickerChange`

        this.element = app;
        this.store = store;

        /** @type {(() => void)[]} */
        this.cleanup = [];

        /** @type {import("ui/src/wc/theme-handler").ThemeHandler} */
        this.themeHandler = document.querySelector("#themeHandler");

        this.db;

        this.lang = new Language();

        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

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
            this.store.on(
                "theme",
                (/**@type{import("./types").ThemeStore}*/ data) => {
                    utils.setTheme(data, this.themeHandler);
                },
            ),
            this.store.on(
                "lang",
                (/**@type{import("./types").LangStore}*/ data) => {
                    this.#onlang(data);
                },
            ),
        );

        if (!!this.db) this.db.close();
        this.db = new DB("shift-scheduler", 1);

        // TODO: ...

        // StackLayout
        // TODO: Move to constructor
        this.stackLayout.registerPage("calendar", () =>
            document
                .querySelector("template#pageCalendar")
                .content.cloneNode(true),
        );

        // TODO: Move to constructor
        this.stackLayout.registerPage("pdf", () =>
            // @ts-expect-error
            document.querySelector("template#pagePDF").content.cloneNode(true),
        );

        // TODO: Move to constructor
        this.stackLayout.registerPage("settings", () =>
            // @ts-expect-error
            document
                .querySelector("template#pageSettings")
                .content.cloneNode(true),
        );

        this.stackLayout.events.addListener(
            "change",
            this.#onStackLayoutChange,
        );

        // TODO: Get the last used date from the local storage
        this.setMonth(new Date());

        return this;
    }

    onDestroy() {
        // Close database
        if (!!this.db) this.db.close();

        this.cleanup.forEach((callback) => callback());

        // TODO: ...

        // StackLayout event: "change"
        this.stackLayout.events.removeListener(
            "change",
            this.#onStackLayoutChange,
        );

        return this;
    }

    run() {
        // Setup pages
        this.stackLayout.setPage("calendar");

        return this;
    }

    getMonth() {
        let [year, month] = this.datePickerButton.innerText.split("/");

        if (!year || !month) throw `the date-picker button contains no date!`;

        if (isNaN(Number(year)) || isNaN(Number(month)))
            throw `the date-picker button contains no date!`;

        return new Date(Number(year), Number(month) - 1, 1);
    }

    /** @param {Date} date */
    setMonth(date) {
        this.datePickerButton.innerText = this.getMonthString(date);
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
        this.title.innerHTML = `<h3>${title}</h3>`;
    }

    /** @param {import("./types").LangStore} data */
    async #onlang(data) {
        await this.language.setLanguage(data);
    }

    #noPageSetup() {
        this.setTitle("");
        this.datePickerButton.style.display = "none";
        this.editButton.style.display = "none";
        this.todayButton.style.display = "none";
        this.pdfButton.style.display = "none";
        this.settingsButton.style.display = "none";
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #calendarPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "");
        this.datePickerButton.style.display = "flex";
        this.editButton.style.display = "flex";
        this.todayButton.style.display = "flex";
        this.pdfButton.style.display = "flex";
        this.settingsButton.style.display = "flex";
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #settingsPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "");
        this.datePickerButton.style.display = "none";
        this.editButton.style.display = "none";
        this.todayButton.style.display = "none";
        this.pdfButton.style.display = "none";
        this.settingsButton.style.display = "none";
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #pdfPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "");
        this.datePickerButton.style.display = "none";
        this.editButton.style.display = "none";
        this.todayButton.style.display = "none";
        this.pdfButton.style.display = "none";
        this.settingsButton.style.display = "none";
    }
}
