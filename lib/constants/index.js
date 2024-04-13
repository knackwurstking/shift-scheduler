/**
 * @type {{
 *  db: {
 *    custom: {
 *      version?: number;
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
      version: 1, // TODO: Set the current version number in use
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
