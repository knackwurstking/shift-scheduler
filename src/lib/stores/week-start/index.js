import { writable } from "svelte/store";

const storageKey = "week-start-store";

/** @type {import("svelte/store").Writable<_WeekStartDays>} */
const weekStart = writable((() => {
  /** @type {_WeekStartDays} */
  // @ts-ignore
  const ws = localStorage.getItem(storageKey) || "sun";
  return ws;
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
