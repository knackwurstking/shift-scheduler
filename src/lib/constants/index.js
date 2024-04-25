export default {
    get theme() {
        return {
            mode: "system",
            name: "zinc",
        };
    },

    /** @type {import("../../types").WeekStartStore} */
    weekStart: 0,

    /** @type {import("../../types").Shift} Just some empty `Shifts` object */
    get shift() {
        return {
            id: 0,
            name: "",
            shortName: "",
            visible: true,
            color: "",
        };
    },

    /** @type {import("../../types").Settings} Just some empty `Settings` object */
    get settings() {
        return {
            shifts: [],
            rhythm: [],
            startDate: "", // ...
        };
    },
};
