<script>
  import { UI } from "ui";

  import { lang } from "../../lib/js";
  import * as Stores from "../../lib/stores";

  import StorageTableHeader from "./StorageTableHeader.svelte";
  import StorageTableBody from "./StorageTableBody.svelte";

  const settingsStorage = Stores.SettingsStorage.create();
</script>

<article class="ui-card has-margin">
  <h3 style="margin: var(--spacing)">
    {lang.get()["settings storage"]["title"]}
  </h3>

  <hr />

  {#if $settingsStorage.open}
    <section>
      <figure>
        <table class="storage-data-table">
          <StorageTableHeader />
          <StorageTableBody />
        </table>
      </figure>
    </section>
  {:else}
    <section>
      <UI.Button.Root color="secondary" on:click={() => settingsStorage.open()}>
        {lang.get()["settings storage"]["button fetch data"]}
      </UI.Button.Root>
    </section>
  {/if}
</article>

<style>
  .storage-data-table :global(tr > *:last-child) {
    width: calc(6em + (4px * 4) + (var(--spacing) * 2));
  }
</style>
