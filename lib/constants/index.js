/**
 * @type {{
 *  db: {
 *    custom: {
 *      name: string;
 *      version: number | null;
 *    };
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
    custom: {
      // NOTE: Contains all the changed user stuff like shifts and notes for each day in a month
      name: "custom",
      version: 1,
    },
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
