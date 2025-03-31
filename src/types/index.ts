import * as ui from "ui";

export * from "./backup";
export * from "./calendar";
export * from "./db";
export * from "./version";

export interface DialogCreate {
    dialog: HTMLDialogElement;
    destroy: ui.CleanUpFunction;
}

export interface Create<
    T extends HTMLElement = HTMLElement,
    M extends {} = {},
> {
    element: T;
    methods: M;
}
