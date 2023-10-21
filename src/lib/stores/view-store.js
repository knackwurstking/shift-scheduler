import { writable } from "svelte/store";

/**
 * @typedef Views
 * @type {"calendar" | "settings"}
 */

/**
 * @type {Views[]}
 */
const stack = [];

/** @type {import("svelte/store").Writable<Views>} */
const view = writable();

export function createViewStore() {
    function history() {
        return [...stack];
    }

    /**
     * @param {Views} _view
     */
    function goto(_view) {
        switch (_view) {
            case "calendar":
                stack.push(_view);
                view.set(_view)
                break
            case "settings":
                stack.push(_view);
                view.set(_view)
                break
        }
    }

    function back() {
        if (stack.length <= 1) {
            return;
        }

        stack.pop();
        view.set(stack[stack.length - 1])
    }

    return {
        ...view,
        history,
        goto,
        back,
    };
}
