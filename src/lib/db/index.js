export { default } from "./db";

/**
 * @typedef DBShift
 * @type {{
 *  id: number;
 *  name: string;
 *  shortName: string;
 *  visible: boolean;
 *  color?: string;
 * }}
 *
 * @typedef DBDay
 * @type {{
 *  date: Date;
 *  shift: DBShift | null;
 *  note: string;
 * }}
 *
 * @typedef DBMonth
 * @type {DBDay[]}
 *
 * @typedef DBEntry
 * @type {{
 *  id: string;
 *  data: DBMonth;
 * }}
 */
