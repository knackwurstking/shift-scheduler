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
   * @type {(data: import("./lib/storage").StorageDataLang) => void|Promise<void>}
   */
  #onlang;
  /**
   * @type {(data: import("./lib/storage").StorageDataTheme) => void|Promise<void>}
   */
  #ontheme;

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
    if (constants.debug) console.log("[app] onMount");

    // create the custom database (shifts and notes per day)
    if (!!this.db) this.db.close();
    this.db = new DB(constants.db.name, constants.db.version);

    // lang storage event listener
    this.#onlang = async (data) => {
      if (constants.debug) console.log(`[Main] storage: "lang"`, data);
      await this.language.setLanguage(data || constants.language);
    };
    this.storage.addListener("lang", this.#onlang);

    // setup theme(s)
    this.theme
      .addTheme("zinc", "/themes/zinc.css")
      .loadTheme(constants.theme.name);

    // theme storage event listener
    this.#ontheme = async (data) => {
      if (constants.debug) console.log(`[Main] storage: "theme"`, data);
      if (!!data?.mode) this.theme.stop().setMode(data.mode);
      else this.theme.start();
    };
    this.storage.addListener("theme", this.#ontheme);
    this.storage.dispatch("theme");

    // set the app language once
    this.storage.dispatchWithData(
      "lang",
      this.storage.get("lang", constants.language),
    );

    // mount components
    this.appBar.onMount();

    return this;
  }

  onDestroy() {
    if (constants.debug) console.log("[app] onDestroy");

    if (!!this.db) this.db.close();
    this.storage.removeListener("lang", this.#onlang);
    this.storage.removeListener("theme", this.#ontheme);

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
