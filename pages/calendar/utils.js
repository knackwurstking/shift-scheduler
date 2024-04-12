/**
 * @param {Date} date
 * @param {StorageDataWeekStart} weekStart
 * @returns {Promise<{ current: Date, data: null }[]>}
 */
export async function getDays(date, weekStart) {
  const days = Array(42).fill({ current: date, data: null });

  // ...

  return days;
}
