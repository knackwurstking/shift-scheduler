/**
 * @param {Date} date
 * @param {StorageDataWeekStart} weekStart
 * @param {import("../../lib/db").default | null} [db]
 * @returns {Promise<import("../../lib/db").DBData[]>}
 */
export async function getDays(date, weekStart, db = null) {
  /** @type {import("../../lib/db").DBData[]} */
  const days = Array(42).fill({ date: date, shift: null, note: "" });

  // TODO: Fill days array, only for the current month, ...
  // ...

  return days;
}
