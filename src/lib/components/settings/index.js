export { default } from "./View.svelte";

/**
 * @typedef Modes
 * @type {"auto" | "dark" | "light"}
 *
 * @typedef Themes
 * @type {"custom" | "picocss" | "green"}
 * 
 * @typedef Shift 
 * @type {import("../shift").Shift}
 *
 * @typedef Settings
 * @type {{
 *  shifts: Shift[];
 *  startDate: string | Date;
 *  shiftRhythm: string[];
 *  currentTheme: Themes;
 *  mode: Modes;
 * }}
 */
