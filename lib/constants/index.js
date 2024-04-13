/**
 * @type {{
 *  db: {
 *    name: string;
 *    version: number | null;
 *  };
 *  theme: { name: string };
 *  storagePrefix: string;
 *  language: Languages;
 *  weekStart: StorageDataWeekStart;
 *  swipeRange: number;
 *  debug: boolean;
 * }}
 */
export default {
  db: {
    name: "shift-scheduler",
    version: 1,
  },
  theme: {
    name: "zinc",
  },
  storagePrefix: "shift-scheduler:",
  language: "de",
  weekStart: 1,
  swipeRange: 75,
  debug: true,
};
