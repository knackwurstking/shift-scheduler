/**
 * @type {{
 *  db: {
 *    name: string;
 *    version: number | null;
 *  };
 *  theme: import("../storage").StorageDataTheme;
 *  storagePrefix: string;
 *  language: import("../language").Languages;
 *  weekStart: import("../storage").StorageDataWeekStart;
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
        mode: "system",
        name: "zinc",
    },
    storagePrefix: "shift-scheduler:",
    language: "en",
    weekStart: 0,
    swipeRange: 75,
    debug: false,
};
