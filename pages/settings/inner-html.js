const backup = `
<article class="ui-card backup">
    <h3 class="title">
      <!-- TODO: Title span? (replace) -->
      <span data-replace="backupTitle"></span>
    </h3>

    <hr />

    <section>
        <div class="ui-grid-row actions">
            <!-- TODO: Import button (replace) -->
            <span data-replace="backupImportButton"></span>

            <!-- TODO: Export button (replace) -->
            <span data-replace="backupExportButton"></span>
        </UI.FlexGrid.Row>
    </section>
</article>
`;

export default `
${backup}

<br />

<!-- TODO: Shifts -->

<br />

<!-- TODO: Backup -->

<br />

<!-- TODO: Storage -->
`;
