type AppBarGroupKeys = "" | "calendar" | "pdf" | "settings";

interface AppBarGroups {
  "": HTMLElement[];
  calendar: HTMLElement[];
  pdf: HTMLElement[];
  settings: HTMLElement[];
}

type AppBarElements =
  | "backButton"
  | "datePicker"
  | "title"
  | "editMode"
  | "today"
  | "pdf"
  | "settings";

interface AppBarHTML {
  backButton: HTMLElement;
  datePicker: HTMLElement;
  title: HTMLElement;
  editMode: HTMLElement;
  today: HTMLElement;
  pdf: HTMLElement;
  settings: HTMLElement;
}

type AppBarEventTypes = "datepickerchange";

type Languages = "en" | "de";

type LanguageDataGroups = "weekDays";

type StorageKeys = "theme" | "lang" | "week-start";

interface StorageDataTheme {
  mode: ("dark" | "light") | null;
}

type StorageDataLang = Languages;

type StorageDataWeekStart = 0 | 1;

interface Page {
  getName(): string;
  getTitle(): string;
  getContainer(): HTMLElement;
  onMount(): void;
  onDestroy(): void;
}
