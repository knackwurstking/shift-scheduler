import { writable } from "svelte/store";

/** @type {import("svelte/store").Writable<number>} */
const editModeIndex = writable(-1)

/** @type {import("svelte/store").Writable<boolean>} */
const editMode = writable(false);

export function createEditModeIndexStore() {
    function reset() {
        editModeIndex.set(-2);
    }

    function unselect() {
        editModeIndex.set(-1);
    }

    /**
     * @param {number} n
     */
    function select(n) {
        if (n > -1) editModeIndex.set(n);
    }

    return {
        ...editModeIndex,
        reset,
        unselect,
        select,
    };
}

export function createEditModeStore() {
    function enable() {
        editMode.set(true)
    }

    function disable() {
        editMode.set(false)
    }

    function toggle() {
        editMode.update((v) => !v);
    }

    return {
        ...editMode,
        enable,
        disable,
        toggle,
    };
}
