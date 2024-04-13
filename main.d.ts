type Languages = "en" | "de";

type LanguageDataGroups = "weekDays";

interface StorageDataTheme {
  mode: ("dark" | "light") | null;
}

type StorageDataLang = Languages;

type StorageDataWeekStart = 0 | 1;
