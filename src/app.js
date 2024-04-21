import { constants, DB, Language, Storage } from "./lib";
import ui from "ui";
import * as utils from "./utils";

export const eventDatePickerChange = "datepickerchange"

/**
 * @typedef {import("ui/src/wc").Button} Button 
 * @typedef {import("ui/src/wc").IconButton} IconButton 
 * @typedef {import("ui/src/wc").StackLayout} StackLayout 
 */

export class App extends ui.events.Events {
    /** @type {Element} */
    #root;

    /** @param {import("./lib/storage").StorageDataLang} data */
    #onlang = async (data) => {
        await this.language.setLanguage(data || constants.language);
    };

    #onBackButtonClick = async () => this.stackLayout.goBack();
    #onDatePickerButtonClick = async () => null; // TODO: Add date-picker onclick callback
    #onEditButtonClick = async () => null; // TODO: Add edit onclick callback
    #onTodayButtonClick = async () => this.setMonth(new Date());
    #onPDFButtonClick = async () => this.stackLayout.setPage("pdf");
    #onSettingsButtonClick = async () => this.stackLayout.setPage("settings");

    /** @param {import("ui/src/wc").StackLayoutPage | null} page */
    #onStackLayoutChange = async (page) => {
        // Setup back button
        if (this.stackLayout.stack.length <= 1) {
            this.backButton.style.display = "none";
        } else {
            this.backButton.style.display = "flex";
        }

        if (!page) {
            this.#noPageSetup()
        }

        switch (page.name) {
            case "calendar":
                // @ts-expect-error
                page.app = this;
                this.#calendarPageSetup(page)
                break;
            case "settings":
                // @ts-expect-error
                page.app = this;
                this.#settingsPageSetup(page)
                break;
            case "pdf":
                this.#pdfPageSetup(page)
                break;
            default:
                throw `unknown page "${page.name}"`
        }
    }

    /**
     * @param {Element} app
     */
    constructor(app) {
        super(constants.debug) // NOTE: Events: `eventDatePickerChange`
        this.#root = app;

        this.db;
        this.storage = new Storage();
        this.language = new Language(this);

        /** @type {import("ui/src/wc/theme-handler").ThemeHandler} */
        this.themeHandler = document.querySelector("#themeHandler")
        utils.setTheme(
            this.storage.get("theme", constants.theme),
            this
        );

        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");
        this.stackLayout.debug = constants.debug

        // AppBar left slot
        /** @type {IconButton} */
        this.backButton = document.querySelector("#appBarBackButton");
        /** @type {Button} */
        this.datePickerButton = document.querySelector(
            "#appBarDatePickerButton",
        );

        // AppBar center slot
        /** @type {HTMLElement} */
        this.title = document.querySelector("#appBarTitle");

        // AppBar right slot
        /** @type {IconButton} */
        this.editButton = document.querySelector("#appBarEditButton");
        /** @type {IconButton} */
        this.todayButton = document.querySelector("#appBarTodayButton");
        /** @type {IconButton} */
        this.pdfButton = document.querySelector("#appBarPDFButton");
        /** @type {IconButton} */
        this.settingsButton = document.querySelector("#appBarSettingsButton");
    }

    get element() {
        return this.#root;
    }

    onMount() {
        if (constants.debug) console.log("[app] onMount");

        // Initialize the database, close if already exists
        if (!!this.db) this.db.close();

        this.db = new DB(constants.db.name, constants.db.version);

        this.storage.addListener("lang", this.#onlang);

        // Trigger (storage) language event - this will initially load the language data
        this.storage.dispatchWithData(
            "lang",
            this.storage.get("lang", constants.language),
        );

        // Set on click handlers
        this.backButton.onclick = () => this.#onBackButtonClick();
        this.datePickerButton.onclick = () => this.#onDatePickerButtonClick();
        this.editButton.onclick = () => this.#onEditButtonClick();
        this.todayButton.onclick = () => this.#onTodayButtonClick();
        this.pdfButton.onclick = () => this.#onPDFButtonClick();
        this.settingsButton.onclick = () => this.#onSettingsButtonClick();

        // StackLayout
        this.stackLayout.registerPage("calendar", () =>
            // @ts-expect-error
            document.querySelector("template#pageCalendar").content.cloneNode(true));

        this.stackLayout.registerPage("pdf", () =>
            // @ts-expect-error
            document.querySelector("template#pagePDF").content.cloneNode(true));

        this.stackLayout.registerPage("settings", () =>
            // @ts-expect-error
            document.querySelector("template#pageSettings").content.cloneNode(true));

        this.stackLayout.events.addListener("change", this.#onStackLayoutChange)

        // TODO: Get the last used date from the local storage
        this.setMonth(new Date());

        return this;
    }

    onDestroy() {
        if (constants.debug) console.log("[app] onDestroy");

        // Close database
        if (!!this.db) this.db.close();

        // Storage event: "lang"
        this.storage.removeListener("lang", this.#onlang);

        // StackLayout event: "change"
        this.stackLayout.events.removeListener("change", this.#onStackLayoutChange)

        return this;
    }

    run() {
        // Setup pages
        this.stackLayout.setPage("calendar");

        return this;
    }

    getMonth() {
        let [year, month] = this.datePickerButton.innerText.split("/");

        if (!year || !month)
            throw `the date-picker button contains no date!`;

        if (isNaN(Number(year)) || isNaN(Number(month)))
            throw `the date-picker button contains no date!`;

        return new Date(Number(year), Number(month) - 1, 1);
    }

    /** @param {Date} date */
    setMonth(date) {
        this.datePickerButton.innerText = this.getMonthString(date);
        this.dispatchWithData(eventDatePickerChange, date)
    }

    /** @param {Date} date */
    getMonthString(date) {
        return `${date.getFullYear()} / ${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    }

    goNextMonth() {
        const date = this.getMonth()
        date.setMonth(date.getMonth() + 1);
        this.setMonth(date)
    }

    goPrevMonth() {
        const date = this.getMonth()
        date.setMonth(date.getMonth() - 1);
        this.setMonth(date)
    }

    /**
     * @param {string} title
     */
    setTitle(title) {
        this.title.innerHTML = `<h3>${title}</h3>`
    }

    #noPageSetup() {
        this.setTitle("")
        this.datePickerButton.style.display = "none"
        this.editButton.style.display = "none"
        this.todayButton.style.display = "none"
        this.pdfButton.style.display = "none"
        this.settingsButton.style.display = "none"
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #calendarPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "")
        this.datePickerButton.style.display = "flex"
        this.editButton.style.display = "flex"
        this.todayButton.style.display = "flex"
        this.pdfButton.style.display = "flex"
        this.settingsButton.style.display = "flex"
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #settingsPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "")
        this.datePickerButton.style.display = "none"
        this.editButton.style.display = "none"
        this.todayButton.style.display = "none"
        this.pdfButton.style.display = "none"
        this.settingsButton.style.display = "none"
    }

    /**
     * @param {import("ui/src/wc").StackLayoutPage} page
     */
    #pdfPageSetup(page) {
        this.setTitle(page.getAttribute("title") || "")
        this.datePickerButton.style.display = "none"
        this.editButton.style.display = "none"
        this.todayButton.style.display = "none"
        this.pdfButton.style.display = "none"
        this.settingsButton.style.display = "none"
    }
}
