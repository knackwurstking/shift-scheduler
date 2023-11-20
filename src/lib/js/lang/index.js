const data = {
    "en": {
        datePickerDialog: {
            title: "Date Picker",
            inputAndroidLabel: "Pick a Date",
            input1Label: "Year",
            input2Label: "Month",
        },
        dayDialog: {
            textfieldLabel: "Note",
        },
        rhythmDialog: {
            title: "Shift Rhythm",
        },
        shiftDialog: {
            titleEdit: "Edit Shift",
            titleNew: "New Shift",
            longName: "Shift Name (ex.: Night)",
            shortName: "Short (ex.: N)",
            hideShiftInputLabel: "Hide shift name from the calendar",
            pickBackgroundColorLabel: "Pick a background color",
            disableBackgroundColorLabel: "Disable background color",
        },
        storageDialog: {
            tableHeaderDay: "Day",
            tableHeaderShift: "Shift",
            tableHeaderNote: "Note",
        },
        settingsView: {
            titleShifts: "Shift Settings",
            tableHeaderName: "Name",
            tableHeaderShort: "Short",
            tableHeaderColor: "Color",
            addShiftButton: "Add a new shift",
            startDatePrimaryText: "Start Date",
            rhythmPrimaryText: "Rhythm",

            titleMisc: "Miscellaneous",
            miscThemePrimaryText: "Theme",
            miscWeekStartPrimaryText: "The week starts on Monday",

            titleStorage: "Data Storage",
            labelupdownPrimaryText: "Upload/Download",
            labelupdownSecondaryText: "Upload or download backup data",
            storageFetchDataButton: "Fetch Data",
            tableHeaderYear: "Year",
            tableHeaderMonth: "Month",
        },
        appBar: {
            settings: "Settings",
        },
        buttons: {
            edit: "Edit",
            submit: "OK",
        },
        misc: {
            sun: "Sun",
            mon: "Mon",
            tue: "Tue",
            wed: "Wed",
            thu: "Thu",
            fri: "Fri",
            sat: "Sat",
        },
    },
    "de": {
        datePickerDialog: {
            title: "Datumsauswahl",
            inputAndroidLabel: "Wähle ein Datum",
            input1Label: "Jahr",
            input2Label: "Monat",
        },
        dayDialog: {
            textfieldLabel: "Notiz",
        },
        rhythmDialog: {
            title: "Schicht Rhythmus",
        },
        shiftDialog: {
            titleEdit: "Schicht Bearbeiten",
            titleNew: "Neue Schicht",
            longName: "Schicht Name (Bsp.: Nacht)",
            shortName: "Kürzel (Bsp.: N)",
            hideShiftInputLabel: "Schicht aus dem Kalendar ausblenden",
            pickBackgroundColorLabel: "Hintergrundfarbe wählen",
            disableBackgroundColorLabel: "Hintergrundfarbe deaktivieren",
        },
        storageDialog: {
            tableHeaderDay: "Tag",
            tableHeaderShift: "Schicht",
            tableHeaderNote: "Notiz",
        },
        settingsView: {
            titleShifts: "Schichteinstellungen",
            tableHeaderName: "Name",
            tableHeaderShort: "Kürzel",
            tableHeaderColor: "Farbe",
            addShiftButton: "Neue Schicht hinzufügen",
            startDatePrimaryText: "Start Datum",
            rhythmPrimaryText: "Rhythmus",

            titleMisc: "Sonstiges",
            miscThemePrimaryText: "Theme",
            miscWeekStartPrimaryText: "Die Woche beginnt am Montag",

            titleStorage: "Datenspeicher",
            labelupdownPrimaryText: "Hochladen/Runterladen",
            labelupdownSecondaryText: "Backup hochladen oder runterladen",
            storageFetchDataButton: "Daten abrufen",
            tableHeaderYear: "Jahr",
            tableHeaderMonth: "Monat",
        },
        appBar: {
            settings: "Einstellungen",
            pdf: "PDF Generation",
        },
        buttons: {
            edit: "Bearbeiten",
            submit: "OK",
        },
        misc: {
            sun: "So",
            mon: "Mo",
            tue: "Di",
            wed: "Mi",
            thu: "Do",
            fri: "Fr",
            sat: "Sa",
        },
    },
};

export let defaultLanguage = "en";
export let lang = (() => {
    const match = navigator.languages.find((navigatorLanguage) => {
        if (!!Object.keys(data).find(language => language === navigatorLanguage)) {
            return true;
        }
        return false;
    });

    if (!match) {
        const l = navigator.language.split("-", 1)[0];
        return Object.keys(data).find(language => language === l) || defaultLanguage;
    }

    return match;
})();

/**
 * @param {string} group
 * @param {string} key
 * @returns {string | null}
 */
export function get(group, key) {
    try {
        return data[lang][group][key];
    } catch {
        console.error(`lang (${lang}): "${group}" -> "${key}" not found!`);
        return null;
    }
}

