package types

import "time"

type DBEntry struct {
	Year  int
	Month time.Month
	Day   int
	Shift any // TODO: Need a shift type here
	Note  string
}
