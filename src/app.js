import { StackLayout } from "./components";
import { constants, DB, Language, Storage } from "./lib";

export class App {
    /** @type {Element} */
    #root;

    /**
     * @type {(data: import("./lib/storage").StorageDataLang) => void|Promise<void>}
     */
    #onlang;

    /**
     * @param {Element} app
     */
    constructor(app) {
        this.#root = app;

        this.db;
        this.storage = new Storage();
        this.language = new Language(this);

        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("stack-layout");

        // AppBar left slot
        /** @type {import("ui/src/web-components/button/icon-button").IconButton} */
        this.backButton = document.querySelector("#appBarBackButton");
        /** @type {import("ui/src/web-components/button/button").Button} */
        this.datePickerButton = document.querySelector(
            "#appBarDatePickerButton",
        );

        // AppBar center slot
        /** @type {HTMLElement} */
        this.title = document.querySelector("#appBarTitle");

        // AppBar right slot
        /** @type {import("ui/src/web-components/button/icon-button").IconButton} */
        this.editButton = document.querySelector("#appBarEditButton");
        /** @type {import("ui/src/web-components/button/icon-button").IconButton} */
        this.todayButton = document.querySelector("#appBarTodayButton");
        /** @type {import("ui/src/web-components/button/icon-button").IconButton} */
        this.pdfButton = document.querySelector("#appBarPDFButton");
        /** @type {import("ui/src/web-components/button/icon-button").IconButton} */
        this.settingsButton = document.querySelector("#appBarSettingsButton");
    }

    onMount() {
        if (constants.debug) console.log("[app] onMount");

        // Initialize the database, close if already exists
        if (!!this.db) this.db.close();

        this.db = new DB(constants.db.name, constants.db.version);

        // Storage event: "lang"
        this.#onlang = async (data) => {
            if (constants.debug) console.log(`[app] storage: "lang"`, data);
            await this.language.setLanguage(data || constants.language);
        };

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

        return this;
    }

    onDestroy() {
        if (constants.debug) console.log("[app] onDestroy");

        // Close database
        if (!!this.db) this.db.close();

        // Storage event: "lang"
        this.storage.removeListener("lang", this.#onlang);

        return this;
    }

    getElement() {
        return this.#root;
    }

    run() {
        // Setup pages
        this.stackLayout.app = this;
        this.stackLayout.setPage(this.stackLayout.pages.calendar);

        return this;
    }

    #onBackButtonClick() {
        // ...
    }

    #onDatePickerButtonClick() {
        // ...
    }

    #onEditButtonClick() {
        // ...
    }

    #onTodayButtonClick() {
        // ...
    }

    #onPDFButtonClick() {
        // ...
    }

    #onSettingsButtonClick() {
        // ...
    }
}
