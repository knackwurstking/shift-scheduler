export * as appBarUtils from "./app-bar-utils";
export * as backupUtils from "./backup-utils";
export * as calendarUtils from "./calendar-utils";
export * as constants from "./constants";
export * as database from "./database";
export * as searchUtils from "./search-utils";
export * as store from "./store";

import * as database from "./database";

export const html = String.raw;
export const db = new database.DB("shift-scheduler", 1);
