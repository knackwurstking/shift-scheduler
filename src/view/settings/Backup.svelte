<script>
    import FileImportOutline from "svelte-material-icons/FileImportOutline.svelte";
    import FileExportOutline from "svelte-material-icons/FileExportOutline.svelte";

    import { Text, Button } from "svelte-css";

    import * as lang from "../../lib/js/lang";

    /***********************
     * Function Definitions
     ***********************/

    async function importBackup() {
        // TODO: import settings and storage data "shift-scheduler-backup.json"
    }

    async function exportBackup() {
        // TODO: export settings and storage data "shift-scheduler-backup.json"
    }
</script>

<article class="ui-card has-margin">
    <section>
        <Text.Label
            primary={lang.get("settingsView", "labelupdownPrimaryText")}
            secondary={lang.get(
                "settingsView",
                "labelupdownSecondaryText"
            )}
            row
        >
            <Button.Icon
                style="margin: calc(var(--spacing) / 2)"
                on:click={() => importBackup()}
            >
                <FileImportOutline />
            </Button.Icon>
            <Button.Icon
                style="margin: calc(var(--spacing) / 2)"
                on:click={() => exportBackup()}
            >
                <FileExportOutline />
            </Button.Icon>
        </Text.Label>
    </section>
</article>
