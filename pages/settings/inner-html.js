const misc = `
<article class="ui-card has-margin">
    <h3 class="title">
        <span data-replace="miscTitle"></span>
    </h3>

    <hr />

    <!-- week-start settings -->
    <section>
        <!-- checkbox if the week should start on monday or not -->
        <span data-replace="miscWeekStart"></span>
    </section>

    <hr />

    <!-- theme settings -->
    <section>
        <span data-replace="miscThemeMode"></span>

        <!--hr /-->

        <!-- TODO: maybe add some theme picker select box for "zinc" and some future themes available -->
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
        <div class="ui-grid-row actions" style="--gap: 0.1em;">
            <span data-replace="backupImportButton"></span>

            <span data-replace="backupExportButton"></span>
        </div>
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
