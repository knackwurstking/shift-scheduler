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
