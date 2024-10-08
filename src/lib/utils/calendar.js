/**
 * @param {number} year
 * @param {number} month
 * @param {SchedulerStore} store
 * @returns {Promise<DB_Entry[]>}
 */
export async function getArray(year, month, store) {
  /** @type {DB_Entry[]} */
  const data = [];
  const weekStart = store.ui.get("week-start");
  const settings = store.ui.get("settings");

  for (let i = 0; i < 42; i++) {
    const date = new Date(
      year,
      month,
      i + 1 - getStartDay(year, month, weekStart),
    );

    data.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      shift: calcShiftForDay(date, settings),
      note: "",
    });
  }

  return data;
}

/**
 * @param {Date} current
 * @param {SchedulerStore_Settings} settings
 * @returns {Shift| null}
 */
export function calcShiftForDay(current, settings) {
  if (!settings.startDate || !settings.rhythm.length) return null;

  const sDate = new Date(settings.startDate);
  const diffInDays = Math.round(
    (current.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays <= 0) {
    return (
      settings.shifts.find(
        (shift) =>
          shift.id ===
          settings.rhythm[
            settings.rhythm.length +
              (diffInDays % settings.rhythm.length || -settings.rhythm.length)
          ],
      ) || null
    );
  }

  return (
    settings.shifts.find(
      (shift) =>
        shift.id === settings.rhythm[diffInDays % settings.rhythm.length],
    ) || null
  );
}

/**
 * @param {number} year
 * @param {number} month
 * @param {SchedulerStore_WeekStart} weekStart
 * @returns {number}
 */
function getStartDay(year, month, weekStart) {
  // NOTE: if month starts on sunday (0), but the week start is set to monday (1), than set it to 6 (sunday becomes 6)
  const date = new Date(year, month, 1);
  const weekDay = date.getDay();

  if (weekStart === 0) return weekDay;
  return weekDay === 0 ? 6 : weekDay - 1;
}
