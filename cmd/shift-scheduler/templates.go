package main

// TODO: Continue here... "The template rendering engine", so to speak :)

// Go: register functions
func tmplUpper(s string) string { return strings.ToUpper(s) }
func tmplAdd(a, b int) int      { return a + b }
func tmplSeq(n int) []int {
	s := make([]int, n)
	for i := range s { s[i] = i + 1 }
	return s
}

func initTemplates() error {
	funcMap := template.FuncMap{
		// NOTE: Currently no functions needed
	}
	var err error
	tmpls, err = template.New("").
		Funcs(funcMap).
		ParseFS(templateFiles, "templates/*.html")
	return err
}
