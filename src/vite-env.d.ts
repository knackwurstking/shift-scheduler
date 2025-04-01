/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
namespace NodeJS {
    interface ProcessEnv {
        MODE: "capacitor" | "github" | "wails" | "";
    }
}

interface Create<T extends HTMLElement = HTMLElement, M extends {} = {}> {
    element: T;
    methods: M;
}

interface CreateDialog {
    dialog: HTMLDialogElement;
    destroy: import("ui").CleanUpFunction;
}
