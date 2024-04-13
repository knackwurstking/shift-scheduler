/**
 * @param {Date} date
 * @param {StorageDataWeekStart} weekStart
 * @param {import("../../lib/db").Custom | null} db
 * @returns {Promise<import("../../lib/db/db-custom").DBCustomData[]>}
 */
export async function getDays(date, weekStart, db = null) {
  /** @type {import("../../lib/db/db-custom").DBCustomData[]} */
  const days = Array(42).fill({ date: date, shift: null, note: "" });
  if (!db) return days;

  // TODO: Fill days array, only for the current month, ...
  // ...

  return days;
}
