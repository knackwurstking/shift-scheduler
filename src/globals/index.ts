import * as database from "./database";
export * as constants from "./constants";
export * as store from "./store";

export const db = new database.DB("shift-scheduler", 1);
