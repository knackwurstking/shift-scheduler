export { default } from "./View.svelte";
export { default as ShiftCard } from "./Shift.svelte";

/**
 * @typedef Modes
 * @type {"auto" | "dark" | "light"}
 *
 * @typedef Themes
 * @type {"custom" | "picocss" | "green"}
 *
 * @typedef Shift
 * @type {{
 *  name: string;
 *  shortName: string;
 *  visible: boolean;
 *  color?: string;
 * }}
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
