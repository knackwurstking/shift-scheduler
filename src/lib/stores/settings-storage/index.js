import { writable } from "svelte/store";

const settingsStorage = writable({ open: false, reload: false });

export function create() {
    async function open() {
        settingsStorage.update((data) => ({ ...data, open: true }));
    }

    async function close() {
        settingsStorage.update((data) => ({ ...data, open: false }));
    }

    async function reload() {
        settingsStorage.update((data) => ({ ...data, reload: !data.reload }));
    }

    return {
        ...settingsStorage,
        open, close,
        reload,
    };
}
