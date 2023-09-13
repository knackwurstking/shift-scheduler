export { default } from "./View.svelte";
export { default as ShiftCard } from "./Shift.svelte";

/**
 * @typedef Themes
 * @type {"custom"}
 *
 * @typedef Shift
 * @type {{
 *  name: string;
 *  shortName: string;
 *  visible: boolean;
 * }}
 * 
 * @typedef Settings
 * @type {{
 *  shifts: Shift[];
 *  startDate: string | Date;
 *  shiftRhythm: string[];
 *  currentTheme: Themes;
 * }}
 */
