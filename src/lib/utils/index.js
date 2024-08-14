export * as calendar from "./calendar";

/**
 * @param {SchedulerStore_Theme} theme
 * @param {import("ui").UIThemeHandler} themeHandler
 */
export async function setTheme(theme, themeHandler) {
  //try {
  //    themeHandler.ui.loadTheme(theme.name)
  //} catch {
  //    themeHandler.ui.loadTheme("zinc") // default theme (original)
  //}

  if (theme.mode === "system") {
    // Enable auto mode
    themeHandler.ui.auto = true;
  } else {
    // Disable auto mode and set theme manually
    themeHandler.ui.mode = theme.mode;
    themeHandler.ui.auto = false;
  }
}

/**
 * @param {DB_Shift} shift
 */
export function validateShift(shift) {
  // Check for shift data
  if (typeof shift.id !== "number") {
    return false;
  }

  if (typeof shift.name !== "string" || typeof shift.shortName !== "string") {
    return false;
  }

  if (typeof shift.color !== "string" && !!shift.color) {
    return false;
  }

  if (shift.color === "transparent") {
    shift.visible = false;
    shift.color = null;
  }

  if (typeof shift.visible !== "boolean") {
    shift.visible = true;
  }

  if (!shift.color) {
    shift.color = null;
  }

  return true;
}
