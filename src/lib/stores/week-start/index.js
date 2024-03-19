import { writable } from "svelte/store";

/**
 * @typedef WeekStartDays
 * @type {"sun" | "mon"}
 */

const storageKey = "week-start-store";

/** @type {import("svelte/store").Writable<WeekStartDays>} */
// @ts-ignore
const weekStart = writable((() => {
  return localStorage.getItem(storageKey) || "sun";
})());

weekStart.subscribe((weekStart) => {
  localStorage.setItem(storageKey, weekStart);
})

export function create() {
  function sunday() {
    weekStart.set("sun");
  }

  function monday() {
    weekStart.set("mon");
  }

  return {
    ...weekStart,
    sunday,
    monday,
  };
}
