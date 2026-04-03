export interface Create<
    T extends HTMLElement = HTMLElement,
    M extends {} = {},
> {
    element: T;
    methods: M;
}

export interface CreateDialog {
    dialog: HTMLDialogElement;
    destroy: import("ui").CleanUpFunction;
}
