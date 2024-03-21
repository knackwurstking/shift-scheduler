<script>
  import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";
  import OpenInNew from "svelte-material-icons/OpenInNew.svelte";

  import { UI } from "ui";

  import { db } from "../../lib/js";
  import * as Stores from "../../lib/stores";
  import { StorageDialog } from "../../lib/components";

  const settingsStorage = Stores.SettingsStorage.create();

  /** @type {StorageDialog} */
  let storageDialog;

  function listDataBaseKeys() {
    const keys = db.listKeys();

    const loops = keys.length - 1;
    for (let n = 0; n < loops; n++) {
      for (let i = 0; i < loops; i++) {
        let itemCurrent = keys[i];
        let itemNext = keys[i + 1];

        if (itemCurrent.year > itemNext.year) {
          keys[i] = itemNext;
          keys[i + 1] = itemCurrent;
          itemCurrent = keys[i];
          itemNext = keys[i + 1];
        }

        if (
          itemCurrent.month > itemNext.month &&
          itemCurrent.year === itemNext.year
        ) {
          keys[i] = itemNext;
          keys[i + 1] = itemCurrent;
        }
      }
    }

    return keys;
  }
</script>

<tbody>
  {#key $settingsStorage.reload}
    {#each listDataBaseKeys() as item}
      <tr>
        <td class="is-text-left">{item.year}</td>
        <td class="is-text-left">{item.month + 1}</td>
        <td class="actions is-text-right" style="font-size: 1.1em;">
          <UI.Button.Icon
            style="margin: 4px;"
            ghost
            on:click={() => storageDialog.open(item.year, item.month)}
          >
            <OpenInNew />
          </UI.Button.Icon>

          <UI.Button.Icon
            style="margin: 4px;"
            color="destructive"
            ghost
            on:click={async () => {
              const month = (item.month + 1).toString().padStart(2, "0");
              const yes = window.confirm(
                `Delete all data for "${item.year}/${month}" ?`,
              );
              if (yes) {
                await db.remove(item.year, item.month);
                settingsStorage.reload();
              }
            }}
          >
            <DeleteOutline />
          </UI.Button.Icon>
        </td>
      </tr>
    {/each}
  {/key}
</tbody>

<StorageDialog
  bind:this={storageDialog}
  on:close={async () => {
    storageDialog.close();
  }}
/>
