export default {
    db: {
        name: "shift-scheduler",
        version: 1,
    },

    get theme() {
        return {
            mode: "system",
            name: "zinc",
        }
    },

    storagePrefix: "shift-scheduler:",

    /** @type {import("../../types").Languages} */
    language: "en",

    /** @type {import("../storage").StorageDataWeekStart} */
    weekStart: 0,

    swipeRange: 75,
    debug: false,

    /** @type {import("../../types").Shift} Just some empty `Shifts` object */
    get Shift() {
        return {
            id: 0,
            name: "",
            shortName: "",
            visible: true,
            color: "",
        }
    },

    /** @type {import("../../types").Settings} Just some empty `Settings` object */
    get Settings() {
        return {
            shifts: [],
            rhythm: [],
            startDate: "", // ...
        }
    }
};


