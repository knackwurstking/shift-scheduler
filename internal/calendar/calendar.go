package calendar

import (
	"time"

	"github.com/knackwurstking/shift-scheduler/internal/types"
)

// TODO: Need a test here, with weekStart set to 0 and 1 (sunday and monday)
func GetDataForDays(year int, month time.Month, weekStart time.Weekday) (data [42]types.DBEntry) {
	data = [42]types.DBEntry{}

	t := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	startDay := int(getStartDay(t, weekStart))

	for n := range 42 {
		current := t.AddDate(0, 0, n-startDay)

		data[n] = types.DBEntry{
			Year:  current.Year(),
			Month: current.Month(),
			Day:   current.Day(),
			Shift: nil,
			Note:  "",
		}
	}

	return data
}

func getStartDay(t time.Time, weekStart time.Weekday) time.Weekday {
	// NOTE: Ok, this is still weird to me :(
	weekDay := t.Weekday()

	// In this world the week always starts at sunday not monday
	if weekStart == time.Sunday {
		return weekDay
	}

	if weekDay == time.Sunday {
		return time.Saturday // 6
	} else {
		return weekDay - 1
	}
}

//export function calcShiftForDay(current: Date): Shift | null {
//    const startDate = store.obj.get("startDate")!;
//    const shifts = store.obj.get("shifts")!;
//    const rhythm = store.obj.get("rhythm")!;
//
//    if (!startDate || !rhythm.length) return null;
//
//    const sDate = new Date(startDate);
//    const diffInDays = Math.round(
//        (current.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24),
//    );
//
//    if (diffInDays <= 0) {
//        return (
//            shifts.find(
//                (shift) =>
//                    shift.id ===
//                    rhythm[
//                        rhythm.length +
//                            (diffInDays % rhythm.length || -rhythm.length)
//                    ],
//            ) || null
//        );
//    }
//
//    return (
//        shifts.find(
//            (shift) => shift.id === rhythm[diffInDays % rhythm.length],
//        ) || null
//    );
//}
