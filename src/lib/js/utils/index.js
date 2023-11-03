import { Utils } from "svelte-css";

import { createShiftSetupStore } from "../../stores/shift-setup-store";

const shiftSetup = createShiftSetupStore();

export const isAndroid = Utils.isAndroid;

/**
 * @param {import("../db").DBData} data
 * @returns {Promise<import("../db").DBData>}
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
