# TODO

Refactor this project, kick a-h templ and use golang html templates

- [x] Rename ./assets/ to ./web/ & Changed the package name from assets to go

- [ ] Migrate the index page from ./templates/pages/app.templ (with the layout.templ) to ./web/public/index.html

- [ ] While migrating to the index.html (using html/templates), fix the wasm code if needed (./cmd/wasm)

- [ ] Rendering engine for all the html templates

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
