export * as appBarUtils from "./app-bar-utils";
export * as calendarUtils from "./calendar-utils";
export * as constants from "./constants";
export * as store from "./store";
export * as database from "./database";

import * as database from "./database";

export const html = String.raw;
export const db = new database.DB("shift-scheduler", 1);
