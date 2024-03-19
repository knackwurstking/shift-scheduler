import { writable } from "svelte/store";

/**
 * @typedef Views
 * @type {"calendar" | "settings" | "pdf"}
 */

let lockHistory = false;

/**
 * @type {Views[]}
 */
const stack = [];

/** @type {import("svelte/store").Writable<Views>} */
const view = writable();

export function create() {
  function lock() {
    lockHistory = true;
  }

  function unlock() {
    lockHistory = false;
  }

  function history() {
    return [...stack];
  }

  /**
   * @param {Views} _view
   */
  function goto(_view) {
    if (lockHistory) return;

    switch (_view) {
      case "calendar":
        stack.push(_view);
        view.set(_view)
        break
      case "settings":
        stack.push(_view);
        view.set(_view)
        break
      case "pdf":
        stack.push(_view);
        view.set(_view)
        break;
    }
  }

  function back() {
    if (lockHistory) return;

    if (stack.length <= 1) {
      return;
    }

    stack.pop();
    view.set(stack[stack.length - 1])
  }

  return {
    ...view,
    lock,
    unlock,
    history,
    goto,
    back,
  };
}
