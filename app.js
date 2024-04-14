import { utils } from "ui";
import AppBar from "./components/app-bar";
import constants from "./lib/constants";
import DB from "./lib/db";
import { default as Language } from "./lib/language";
import StackLayout from "./lib/stack-layout";
import Storage from "./lib/storage";
import CalendarPage from "./pages/calendar";

export default class App {
  /** @type {Element} */
  #root;

  /**
   * @param {Element} app
   */
  constructor(app) {
    this.#root = app;
    /** @type {DB} */
    this.db;
    this.storage = new Storage();
    this.language = new Language();
    this.theme = new utils.theme.ThemeHandler();
    this.appBar = new AppBar(this);
    this.stack = new StackLayout(
      document.querySelector("main.container > .stack-layout"),
      this,
    );
  }

  onMount() {
    // create the custom database (shifts and notes per day)
    if (!!this.db) this.db.close(); // TODO: move db to app class
    this.db = new DB(constants.db.name, constants.db.version);

    // lang storage event listener
    this.storage.addListener(
      "lang",
      async (/**@type{import("./lib/storage").StorageDataLang}*/ data) => {
        if (constants.debug) console.log(`[Main] storage: "lang"`, data);
        await this.language.setLanguage(data || constants.language);
        this.storage.dispatch("week-start"); // This will trigger an update on the calendar week days
      },
    );

    this.theme
      .addTheme("zinc", "/themes/zinc.css")
      .loadTheme(constants.theme.name);

    this.storage.addListener(
      "theme",
      /** @param {import("./lib/storage").StorageDataTheme} data*/
      async (data) => {
        if (constants.debug) console.log(`[Main] storage: "theme"`, data);
        if (!!data?.mode) this.theme.stop().setMode(data.mode);
        else this.theme.start();
      },
    );
    this.storage.dispatch("theme");

    //this.language.setLanguage(this.storage.get("lang", constants.language));
    this.storage.dispatchWithData(
      "lang",
      this.storage.get("lang", constants.language),
    );

    this.appBar.onMount();

    return this;
  }

  onDestroy() {
    // TODO: remove all listeners from the onMount function

    return this;
  }

  getElement() {
    return this.#root;
  }

  run() {
    this.stack.setPage(new CalendarPage(this));

    return this;
  }
}
