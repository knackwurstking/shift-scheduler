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
<!-- TODO: Misc -->

<br />

<!-- TODO: Shifts -->

<br />

${backup}

<br />

<!-- TODO: Storage -->
`;
