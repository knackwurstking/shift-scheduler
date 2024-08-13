import { App as CapApp } from "@capacitor/app";
import { CleanUp, html, isAndroid } from "ui";
import { SchedulerAppBar } from "./components";
import { pages } from "./data/constants";
import db from "./db";
import { DatePickerDialog, PDFDialog } from "./dialogs";
import { CalendarPage, SettingsPage } from "./pages";
import { IndexedDBBrowser } from "./pages/settings/sections";
import { setAppBarTitle, setTheme } from "./utils";

export class SchedulerApp extends HTMLElement {
  static register = () => {
    SchedulerAppBar.register();

    CalendarPage.register();
    SettingsPage.register();
    IndexedDBBrowser.register();

    customElements.define("scheduler-app", SchedulerApp);
  };

  constructor() {
    super();
    this.cleanup = new CleanUp();

    /** @type {SchedulerStore} */
    this.uiStore;

    /** @type {import("ui").UIStackLayout} */
    this.uiStackLayout;

    /** @type {import("ui").UILang} */
    this.uiLang;

    /** @type {SchedulerAppBar} */
    this.schedulerAppBar;

    this.render();
  }

  render() {
    this.innerHTML = html`
      <ui-theme-handler auto></ui-theme-handler>

      <ui-store storageprefix="shift-scheduler:" storage></ui-store>

      <ui-lang>
        <ui-lang-type name="en" href="/lang/en.json" fallback></ui-lang-type>
        <ui-lang-type name="de" href="/lang/de.json"></ui-lang-type>
      </ui-lang>

      <ui-container style="width: 100%; height: 100%;">
        <ui-stack-layout></ui-stack-layout>
      </ui-container>

      <scheduler-app-bar></scheduler-app-bar>
    `;

    this.createStore();
    this.createAppBar();
    this.createStackLayout();
    this.createLang();
  }

  connectedCallback() {
    setTimeout(async () => {
      if (isAndroid()) {
        this.cleanup.add(
          (
            await CapApp.addListener("backButton", () =>
              this.uiAppBarItems.back.click(),
            )
          ).remove,
        );
      }
    });

    this.cleanup.add(
      this.uiStore.ui.on(
        "theme",
        (data) => {
          setTheme(data, document.querySelector("ui-theme-handler"));
        },
        true,
      ),

      this.uiStore.ui.on(
        "date-picker",
        async (dateString) => {
          const today = new Date();
          const current = new Date(dateString);

          const y = current.getFullYear();
          const m = (current.getMonth() + 1).toString().padStart(2, "0");
          this.uiAppBarItems.datePicker.innerText = `${y} / ${m}`;

          if (
            today.getFullYear() === current.getFullYear() &&
            today.getMonth() === current.getMonth()
          ) {
            this.uiAppBarItems.today.ui.disabled = true;
          } else {
            this.uiAppBarItems.today.ui.disabled = false;
          }
        },
        true,
      ),
    );

    db.open(async () => this.uiStackLayout.ui.set("calendar"));
  }

  disconnectedCallback() {
    this.cleanup.run();
  }

  createStore() {
    this.uiStore = this.querySelector("ui-store");

    const date = new Date();
    this.uiStore.ui.set(
      "date-picker",
      new Date(date.getFullYear(), date.getMonth(), 1).toString(),
      true,
    );

    this.uiStore.ui.set("theme", { mode: "system", name: "zinc" }, true);
    this.uiStore.ui.set("week-start", 0, true);

    this.uiStore.ui.set(
      "settings",
      { shifts: [], rhythm: [], startDate: "" },
      true,
    );

    this.uiStore.ui.set("edit-mode", { open: false, active: null }, true);
  }

  createAppBar() {
    this.schedulerAppBar = this.querySelector("ui-app-bar");

    // TODO: Continue here... move app-bar stuff to `SchedulerAppBar`

    /** @type {import("ui").UIIconButton} */
    this.uiAppBarItems.back.onclick = async () => {
      if (this.uiStackLayout.ui.size() > 1) {
        this.uiStackLayout.ui.goBack();
      }
    };

    this.uiAppBarItems.datePicker.onclick = async () => {
      const dialog = new DatePickerDialog(this.uiStore, this.uiLang);

      dialog.ui.events.on("close", () => {
        document.body.removeChild(dialog);
      });

      document.body.appendChild(dialog);
      dialog.ui.open(true);
    };

    this.uiAppBarItems.edit.onclick = async () => {
      this.uiStore.ui.update("edit-mode", (data) => ({
        ...data,
        open: !data.open,
      }));
    };

    this.uiAppBarItems.today.onclick = async () => {
      const t = new Date();
      this.uiStore.ui.set(
        "date-picker",
        new Date(t.getFullYear(), t.getMonth(), 1).toString(),
      );
    };

    this.uiAppBarItems.pdf.onclick = async () => {
      const dialog = new PDFDialog(this.uiStore, this.uiLang);
      document.body.appendChild(dialog);

      dialog.ui.events.on("close", () => {
        document.body.removeChild(dialog);
      });

      dialog.ui.open(true);
    };

    this.uiAppBarItems.settings.onclick = async () => {
      this.uiStackLayout.ui.set("settings");
    };
  }

  createStackLayout() {
    this.uiStackLayout = this.querySelector("ui-stack-layout");

    this.uiStackLayout.ui.events.on(
      "change",
      this.stackLayoutChangeHandler.bind(this),
    );

    this.uiStackLayout.ui.register(pages.calendar, () => {
      return new CalendarPage();
    });

    this.uiStackLayout.ui.register(pages.settings, () => {
      return new SettingsPage();
    });

    this.noPageSetup();
  }

  createLang() {
    this.uiLang = this.querySelector("ui-lang");

    this.uiLang.ui.events.on("change", (ltElement) => {
      if (!ltElement) {
        return;
      }

      console.debug(`[SchedulerApp] Set language:`, ltElement);
      this.uiStore.ui.set("lang", ltElement.ui.name);
    });

    // Iinitialize language
    for (const l of ["en", "de"]) {
      if (navigator.language.match(new RegExp(`^${l}`, "i"))) {
        this.uiLang.setAttribute("current", l);
        break;
      }
      // NOTE: No need for iterating through `navigator.languages`,
      //       only two languages are supported for now.
    }

    if (!this.uiLang.hasAttribute("current")) {
      this.uiLang.setAttribute("current", this.uiLang.ui.fallback().ui.name);
    }
  }

  resetAppBar() {
    this.uiAppBar.removeChild(this.uiAppBarItems.back.parentElement);
    this.uiAppBar.removeChild(this.uiAppBarItems.datePicker.parentElement);
    this.uiAppBar.removeChild(this.uiAppBarItems.edit.parentElement);
    this.uiAppBar.removeChild(this.uiAppBarItems.today.parentElement);
    this.uiAppBar.removeChild(this.uiAppBarItems.pdf.parentElement);
    this.uiAppBar.removeChild(this.uiAppBarItems.settings.parentElement);
  }

  noPageSetup() {
    setAppBarTitle(null);
    this.resetAppBar();
  }

  /**
   * @private
   * @param {Object} data
   * @param {import("ui").UIStackLayoutPage | null} data.newPage
   * @param {import("ui").UIStackLayoutPage | null} data.oldPage
   */
  async stackLayoutChangeHandler({ newPage, oldPage }) {
    // Update the AppBar buttons...
    if (this.uiStackLayout.ui.size() <= 1) {
      try {
        this.uiAppBar.removeChild(this.uiAppBarItems.back.parentElement);
      } catch {}
    } else {
      const leftSlot = this.uiAppBar.ui.leftSlot;
      if (leftSlot.length > 0) {
        this.uiAppBar.insertBefore(
          this.uiAppBarItems.back.parentElement,
          leftSlot[0],
        );
      } else {
        this.uiAppBar.appendChild(this.uiAppBarItems.back.parentElement);
      }
    }

    if (!newPage) {
      this.noPageSetup();
      return;
    }

    switch (newPage.ui.name) {
      case pages.calendar:
      case pages.settings:
      case pages.dbBrowser:
        this.resetAppBar();
        break;
    }

    switch (newPage.ui.name) {
      case pages.calendar:
        this.uiAppBar.appendChild(this.uiAppBarItems.datePicker.parentElement);
        this.uiAppBar.appendChild(this.uiAppBarItems.edit.parentElement);
        this.uiAppBar.appendChild(this.uiAppBarItems.today.parentElement);
        this.uiAppBar.appendChild(this.uiAppBarItems.pdf.parentElement);
        this.uiAppBar.appendChild(this.uiAppBarItems.settings.parentElement);
        break;
      case pages.settings:
        setAppBarTitle(this.uiLang.ui.get("settings", "app-bar-title"));
        break;
      case pages.dbBrowser:
        setAppBarTitle(
          this.uiLang.ui.get("indexeddb-browser", "app-bar-title"),
        );
        break;
    }
  }
}
