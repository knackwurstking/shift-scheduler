const misc = `
<article class="ui-card has-margin">
    <h3 class="title">
        <span data-replace="miscTitle"></span>
    </h3>

    <hr />

    <!-- week-start settings -->
    <section>
        <!-- checkbox if thee week should start on monday or not -->
        <span data-replace="miscWeekStart"></span>
    </section>

    <hr />

    <!-- theme settings -->
    <section>
        <!-- TODO: select box for switching theme modes between "system", "dark" and "light" -->
        <span data-replace="miscThemeMode"></span>
        <!--UI.Text.Label primary={lang.get()["settings misc"]["theme picker"]} row>
            <UI.Input.Select
                items={[
                    { value: "system", label: "System" },
                    { value: "dark", label: "Dark" },
                    { value: "light", label: "Light" },
                ]}
                selected={{
                    value: $theme,
                    label: $theme.charAt(0).toUpperCase() + $theme.slice(1),
                }}
                on:change={(ev) => theme.set(ev.detail.value)}
            />
        </UI.Text.Label-->

        <!--hr /-->

        <!-- TODO: maybe add some theme picker select box for "zink" and some future themes available -->
    </section>
</article>
`;

const backup = `
<article class="ui-card backup">
    <h3 class="title">
        <span data-replace="backupTitle"></span>
    </h3>

    <hr />

    <section>
        <div class="ui-grid-row actions">
            <span data-replace="backupImportButton"></span>

            <span data-replace="backupExportButton"></span>
        </UI.FlexGrid.Row>
    </section>
</article>
`;

export default `
${misc}

<br />

<!-- TODO: Shifts -->

<br />

${backup}

<br />

<!-- TODO: Storage -->
`;
