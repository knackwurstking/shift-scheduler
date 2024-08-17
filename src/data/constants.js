import { styles } from "ui";

export const pages = {
    calendar: "calendar",
    settings: "settings",
    dbBrowser: "indexeddb-browser",
};

export const style = {
    datePickerDialog: {
        flexGrid: styles({
            width: "calc(100vw - 3rem)",
            maxWidth: "18rem",
        }),
    },
    editDayDialog: {
        flexGrid: styles({
            width: "calc(100vw - 3rem)",
            maxWidth: "18rem",
        }),
    },
    editShiftDialog: {
        flexGrid: styles({
            width: "calc(100vw - 3rem)",
            maxWidth: "18rem",
        }),
    },
};
