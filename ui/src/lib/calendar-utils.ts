import * as store from "./store";
import { DBEntry } from "./types.database";
import { Shift, WeekStart } from "./types.store";

export async function getDataForDays(
    size: number,
    year: number,
    month: number,
): Promise<DBEntry[]> {
    const data: DBEntry[] = [];
    const weekStart = store.obj.get("weekStart")!;

    for (let i = 0; i < size; i++) {
        const date = new Date(
            year,
            month,
            i + 1 - getStartDay(year, month, weekStart),
        );

        data.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            shift: calcShiftForDay(date),
            note: "",
        });
    }

    return data;
}

function getStartDay(
    year: number,
    month: number,
    weekStart: WeekStart,
): number {
    // NOTE: if month starts on sunday (0), but the week start is
    //       set to monday (1), than set it to 6 (sunday becomes 6)
    const date = new Date(year, month, 1);
    const weekDay = date.getDay();

    if (weekStart === 0) return weekDay;
    return weekDay === 0 ? 6 : weekDay - 1;
}

export function calcShiftForDay(current: Date): Shift | null {
    const startDate = store.obj.get("startDate")!;
    const shifts = store.obj.get("shifts")!;
    const rhythm = store.obj.get("rhythm")!;

    if (!startDate || !rhythm.length) return null;

    const sDate = new Date(startDate);
    const diffInDays = Math.round(
        (current.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays <= 0) {
        return (
            shifts.find(
                (shift) =>
                    shift.id ===
                    rhythm[
                        rhythm.length +
                            (diffInDays % rhythm.length || -rhythm.length)
                    ],
            ) || null
        );
    }

    return (
        shifts.find(
            (shift) => shift.id === rhythm[diffInDays % rhythm.length],
        ) || null
    );
}
