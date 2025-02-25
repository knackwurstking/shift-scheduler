import * as types from "../../types";

export function shift(shift: types.calendar.Shift): boolean {
    // Check for shift data
    if (typeof shift.id !== "number") {
        return false;
    }

    if (typeof shift.name !== "string" || typeof shift.shortName !== "string") {
        return false;
    }

    if (typeof shift.color !== "string" && !!shift.color) {
        return false;
    }

    if (shift.color === "transparent") {
        shift.visible = false;
        shift.color = null;
    }

    if (typeof shift.visible !== "boolean") {
        shift.visible = true;
    }

    if (!shift.color) {
        shift.color = null;
    }

    return true;
}
