import * as settings from "../settings";

/**
 *
 * @returns {boolean}
 */
export function isAndroid() {
    return /(android)/i.test(navigator.userAgent);
}

/**
 *
 * @param {Date} date
 * @returns {import("../../view/settings").Shift | null}
 */
export function calcShiftStep(date) {
    if (!settings.data?.startDate || !settings.data?.shiftRhythm.length) return null;
    if (typeof settings.data.startDate === "string")
        settings.data.startDate = new Date(settings.data.startDate);

    if (settings.data.startDate.getTime() > date.getTime()) {
        const daysDiff =
            (settings.data.startDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        let index = Math.round(
            settings.data.shiftRhythm.length - (daysDiff % settings.data.shiftRhythm.length)
        );
        if (index === settings.data.shiftRhythm.length) index = 0;

        const s = settings.data.shifts.find(
            (shift) => shift.id === settings.data.shiftRhythm[index]
        );
        return s || null;
    }

    const daysDiff = Math.round(
        (date.getTime() - settings.data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const s = settings.data.shifts.find(
        (shift) =>
            shift.id === settings.data.shiftRhythm[daysDiff % settings.data.shiftRhythm.length]
    );
    return s || null;
}
