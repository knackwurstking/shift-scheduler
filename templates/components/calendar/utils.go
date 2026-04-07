package calendar

func WeekStartAtMonday(lang string) bool {
	switch lang {
	case "de":
		return true
	default:
		return false
	}
}
