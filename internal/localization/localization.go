package localization

func New(language string) *Localization {
	switch language {
	case "de":
		return NewGerman()
	default: // English ("en") is the default
		return NewEnglish()
	}
}

func NewGerman() *Localization {
	return &Localization{
		Sunday:    "Son",
		Monday:    "Mon",
		Tuesday:   "Die",
		Wednesday: "Mit",
		Thursday:  "Don",
		Friday:    "Fre",
		Saturday:  "Sam",

		language: "de",
	}
}

func NewEnglish() *Localization {
	return &Localization{
		Sunday:    "Sun",
		Monday:    "Mon",
		Tuesday:   "Tue",
		Wednesday: "Wed",
		Thursday:  "Thu",
		Friday:    "Fri",
		Saturday:  "Sat",

		language: "en",
	}
}

type Localization struct {
	// Short weekday names
	Sunday    string `json:"sunday"`
	Monday    string `json:"monday"`
	Tuesday   string `json:"tuesday"`
	Wednesday string `json:"wednesday"`
	Thursday  string `json:"thursday"`
	Friday    string `json:"friday"`
	Saturday  string `json:"saturday"`

	// Language code (e.g. "en", "de")
	language string
}

func (l *Localization) Language() string {
	return l.language
}
