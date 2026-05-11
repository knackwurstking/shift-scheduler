# TODO

Refactor this project, kick a-h templ and use golang html templates

- [x] Rename ./assets/ to ./web/ and remove the go file from the web directory and move files from the public/ directory into the assets directory
- [-] The assets directory will no longer be embedded into the binary

- [x] Update the web.go handler to embed the templates directory

- [x] Migrate the index page from ./templates/pages/app.templ (with the layout.templ) to ./web/templates/index.html

- [x] Migrate the ./templates/pages/app.templ to ./web/templates/index.html

- [x] Migrate the calendar swipe and grid system

- [-] Rendering engine for all the HTML templates

- [ ] Fix and improve the already existing WASM code (./cmd/wasm)

    ```go
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
            "upper": tmplUpper,
            "add":   tmplAdd,
            "seq":   tmplSeq,
        }
        var err error
        tmpls, err = template.New("").
            Funcs(funcMap).
            ParseFS(templateFiles, "templates/*.html")
        return err
    }
    ```

    ```html
    <p>{{ upper "hello" }}</p>
    <!-- HELLO -->
    <p>{{ add 5 3 }}</p>
    <!-- 8 -->

    {{ range $i := seq 5 }}
    <div>Item {{ $i }}</div>
    <!-- Item 1, 2, 3, 4, 5 -->
    {{ end }}
    ```

## index.html

```go
func WeekStartAtMonday(lang string) bool {
	switch lang {
	case "de":
		return true
	default:
		return false
	}
}

// [T]emplate [D]ata

type IndexTD struct {
    Localization        *localization.Localization
    DatePickerYear      int
    DatePickerMonth     time.Month
    DatePickerContent   string
    Grids []GridTD
}

type GridTD struct {
    Year  int
    Month time.Month
    WeekDays [7]string // NOTE: Based on configuration (So - Sa or Mo - So, see `WeekStartAtMonday`)
    Rows [5]GridRowTD
}

type GridRowTD struct {
    Cells [7]GridCellTD // NOTE: One week == one Row
}

type GridCellTD struct {
    IsToday         bool
    IsCurrentMonth  bool
    Date            int
}
```
