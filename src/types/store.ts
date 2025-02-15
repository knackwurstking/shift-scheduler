import * as calendar from "./calendar";
import * as settings from "./settings";

export interface Data {
    "date-picker": string;
    "week-start": calendar.WeekStart;

    settings: {
        shifts: settings.Shifts;
        rhythm: settings.Rhythm;
        startDate: settings.StartDate;
    };

    "edit-mode": calendar.EditMode;
}
