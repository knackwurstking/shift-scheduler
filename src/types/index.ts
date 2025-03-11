import * as ui from "ui";

export * as backup from "./backup";
export * as calendar from "./calendar";
export * as db from "./db";
export * from "./version";

export interface DialogCreate {
    dialog: HTMLDialogElement;
    destroy: ui.CleanUpFunction;
}
