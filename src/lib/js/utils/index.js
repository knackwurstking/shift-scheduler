import { JS } from "ui";

import { db } from "..";
import * as Store from "../../stores";

const shiftSetup = Store.ShiftSetup.create();

export const isAndroid = JS.Utils.isAndroid;

/**
 * @param {_DBData} data
 * @returns {Promise<_DBData>}
 */
export async function mergeDataWithShifts(data) {
    for (const key in data) {
        const v = data[key];
        if (v?.shift) {
            v.shift = shiftSetup.mergeShift(v.shift);
        }
    }

    return data;
}

/**
 * @param {number} year
 * @param {number} month
 */
export async function getDaysForMonth(year, month, { weekStart = "sun" } = {}) {
    let sd = new Date(year, month, 1).getDay();
    if (weekStart === "mon") {
        sd = (sd === 0) ? 6 : sd - 1;
    }

    /** @type {_Day[]} */
    let days = [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ].map(() => ({ date: undefined, data: { shift: null, note: "" } }));

    const data = await db.get(year, month);

    for (let i = 0; i < days.length; i++) {
        days[i].date = new Date(year, month, i + 1 - sd);

        const key = `${days[i].date.getFullYear()}-${days[
            i
        ].date.getMonth()}-${days[i].date.getDate()}`;

        let shift = data[key]?.shift;
        if (shift) {
            shift = shiftSetup.getShiftForID(shift.id) || shift;
        }

        days[i].data = {
            shift: shift || shiftSetup.calcShiftStep(days[i].date),
            note: data[key]?.note || "",
        };
    }

    return days;
}
