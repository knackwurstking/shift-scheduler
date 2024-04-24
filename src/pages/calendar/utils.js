/**
 * @param {Date} month
 * @param {import("../../types").WeekStartStore} weekStart
 * @returns {Promise<import("../../types").DBEntryData>}
 */
export async function getMonthArray(month, weekStart) {
    /** @type {import("../../types").DBEntryData} */
    const data = [];

    for (let i = 0; i < 42; i++) {
        data.push({
            date: new Date(
                month.getFullYear(),
                month.getMonth(),
                i + 1 - getStartDay(month, weekStart),
            ),
            shift: null, // TODO: Calc the current shift (rhythm)
            note: "",
        });
    }

    return data;
}

/**
 * @param {import("../../lib").DB | null} db
 * @param {Date} month
 * @param {import("../../types").DBEntryData} days
 * @returns {Promise<import("../../types").DBEntryData>}
 */
export async function fillWithData(db, month, days) {
    // TODO: Fill days array with data from the database
    // ...

    return days;
}

/**
 * @param {Date} month
 * @param {import("../../types").WeekStartStore} weekStart
 * @returns {number}
 */
function getStartDay(month, weekStart) {
    // NOTE: if month starts on sunday (0), but the week start is set to monday (1), than set it to 6 (sunday becomes 6)
    month.setDate(1); // 0-6 Sun-Sat
    const d = month.getDay();
    if (weekStart === 0) return d;
    else if (weekStart === 1) return d === 0 ? 6 : d - 1; // NOTE: This works as long the weekStart is a 0 or a 1
}
