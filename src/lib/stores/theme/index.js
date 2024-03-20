import { writable } from "svelte/store";

const storageKey = "theme-store";

/** @type {import("svelte/store").Writable<_Themes>} */
const theme = writable((() => {
  const theme = localStorage.getItem(storageKey) || "system";
  switch (theme) {
    case "dark":
      return "dark";
    case "light":
      return "light";
    default:
      return "system";
  }
})());

theme.subscribe((theme) => {
  localStorage.setItem(storageKey, theme);
});

export function create() {
  return {
    ...theme,
  };
}
