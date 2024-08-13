type SchedulerStore = import("ui").UIStore<SchedulerStore_Events>;

interface SchedulerStore_Events {
  "date-picker": SchedulerStore_DatePicker;
  theme: SchedulerStore_Theme;
  "week-start": SchedulerStore_WeekStart;
  settings: SchedulerStore_Settings;
  lang: SchedulerStore_Lang;
  "edit-mode": SchedulerStore_EditMode;
}

type SchedulerStore_DatePicker = string;

interface SchedulerStore_Theme {
  mode: "system" | "dark" | "light";
  name: string;
}

type SchedulerStore_WeekStart = 0 | 1;

interface SchedulerStore_Settings {
  shifts: Shift[];
  rhythm: number[];
  /**
   * NOTE: "yyyy-mm-dd"
   */
  startDate: string;
}

type SchedulerStore_Lang = string;

interface SchedulerStore_EditMode {
  open: boolean;
  active: Shift | null;
}
