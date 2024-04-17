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
    }

    onMount() {
        if (constants.debug) console.log("[app] onMount");

        // Initialize the database, close if already exists
        if (!!this.db) this.db.close();

        this.db = new DB(constants.db.name, constants.db.version);

        // Storage event: "lang"
        this.#onlang = async (data) => {
            if (constants.debug) console.log(`[Main] storage: "lang"`, data);
            await this.language.setLanguage(data || constants.language);
        };

        this.storage.addListener("lang", this.#onlang);

        // Trigger (storage) language event - this will initially load the language data
        this.storage.dispatchWithData(
            "lang",
            this.storage.get("lang", constants.language),
        );

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
        // ...

        return this;
    }
}
