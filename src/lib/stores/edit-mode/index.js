import { writable } from "svelte/store";

/** @type {import("svelte/store").Writable<{ open: boolean; index: number; }>} */
const editMode = writable({
    open: false,
    index: -1
});

export function create() {
    function enable() {
        editMode.update((editMode) => ({ ...editMode, open: true }));
    }

    function disable() {
        editMode.update((editMode) => ({ ...editMode, open: false }));
    }

    function toggle() {
        editMode.update((editMode) => ({ ...editMode, open: !editMode.open }));
    }

    function indexReset() {
        editMode.update((editMode) => ({ ...editMode, index: -2 }));
    }

    function indexUnselect() {
        editMode.update((editMode) => ({ ...editMode, index: -1 }));
    }

    /**
     * @param {number} n
     */
    function indexSelect(n) {
        if (n > 1) editMode.update((editMode) => ({ ...editMode, index: n }))
    }

    return {
        ...editMode,
        enable,
        disable,
        toggle,
        indexReset,
        indexUnselect,
        indexSelect,
    };
}
