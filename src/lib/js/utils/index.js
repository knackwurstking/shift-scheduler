/**
 *
 * @returns {boolean}
 */
export function isAndroid() {
    return /(android)/i.test(navigator.userAgent);
}

/**
 *
 * @param {Settings} settings
 * @param {Date} date
 * @returns {Shift | null}
 */
export function calcShiftStep(settings, date) {
    if (!settings.startDate) return;
    if (typeof settings.startDate === "string") settings.startDate = new Date(settings.startDate);

    if (settings.startDate.getTime() > date.getTime()) {
        const daysDiff = (settings.startDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        let index = Math.round(settings.shiftRhythm.length - (daysDiff % settings.shiftRhythm.length));
        if (index === settings.shiftRhythm.length) index = 0;

        const s = settings.shifts.find((shift) => shift.name === settings.shiftRhythm[index]);
        return s;
    }

    const daysDiff = Math.round((date.getTime() - settings.startDate.getTime()) / (1000 * 60 * 60 * 24));

    const s = settings.shifts.find(
        (shift) => shift.name === settings.shiftRhythm[daysDiff % settings.shiftRhythm.length]
    );
    return s;
}
