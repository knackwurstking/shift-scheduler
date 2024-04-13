/**
 * @param {Date} month
 * @param {import("../../lib/storage").StorageDataWeekStart} weekStart
 * @returns {Promise<import("../../lib/db").DBMonth>}
 */
export async function getMonthArray(month, weekStart) {
  /** @type {import("../../lib/db").DBMonth} */
  const days = Array(42).fill({ date: month, shift: null, note: "" });

  // TODO: Only set the dates here, and the shift rhythm

  return days;
}

/**
 * @param {import("../../lib/db").default | null} db
 * @param {Date} month
 * @param {import("../../lib/db").DBMonth} days
 * @returns {Promise<import("../../lib/db").DBMonth>}
 */
export async function fillWithData(db, month, days) {
  // TODO: Fill days array with data from the database
  // ...

  return days;
}
