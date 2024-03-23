<script>
  import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";
  import PencilOutline from "svelte-material-icons/PencilOutline.svelte";

  import { UI } from "ui";

  import { lang } from "../../lib/js";
  import * as Store from "../../lib/stores";

  const shiftSetup = Store.ShiftSetup.create();

  /** @type {import("../../lib/components").ShiftDialog} */
  export let shiftDialog;

  let tableRowHovering = null;
</script>

<table class="shift-table is-max-width">
  <thead>
    <tr>
      <th class="is-text-left">
        {lang.get()["settings shifts"]["table header name"]}
      </th>
      <th class="is-text-left">
        {lang.get()["settings shifts"]["table header short name"]}
      </th>
      <th class="is-text-right" />
    </tr>
  </thead>

  <tbody>
    {#each $shiftSetup.shifts as item, index}
      <tr
        style:background-color={tableRowHovering === index
          ? "hsl(var(--primary))"
          : undefined}
        style:color={tableRowHovering === index
          ? "hsl(var(--primary-fg))"
          : undefined}
        draggable={true}
        on:dragstart={(ev) => {
          ev.dataTransfer.effectAllowed = "move";
          ev.dataTransfer.dropEffect = "move";
          ev.dataTransfer.setData("text/plain", index.toString());
        }}
        on:drop|preventDefault={(ev) => {
          ev.dataTransfer.dropEffect = "move";

          const startIndex = parseInt(
            ev.dataTransfer.getData("text/plain"),
            10,
          );

          shiftSetup.update((setup) => {
            if (startIndex < index) {
              // dragged down
              setup.shifts = [
                ...setup.shifts.slice(0, startIndex),
                ...setup.shifts.slice(startIndex + 1, index + 1),
                setup.shifts[startIndex],
                ...setup.shifts.slice(index + 1),
              ];
            } else {
              // dragged up
              setup.shifts = [
                ...setup.shifts.slice(0, index),
                setup.shifts[startIndex],
                ...setup.shifts.slice(index, startIndex),
                ...setup.shifts.slice(startIndex + 1),
              ];
            }

            return setup;
          });

          tableRowHovering = null;
        }}
        on:dragover|preventDefault={() => false}
        on:dragenter|preventDefault={() => (tableRowHovering = index)}
      >
        <td class="is-text-left">{item.name}</td>

        <td
          class="is-text-left"
          style={`--shift-color: ${item.color || "hsl(var(--fg))"}`}
        >
          {item.visible ? item.shortName : ""}
        </td>

        <td class="is-text-right" style="font-size: 1.1em;">
          <UI.Button.Icon
            style="margin: 4px;"
            ghost
            on:click={() => shiftDialog.open(item)}
          >
            <PencilOutline />
          </UI.Button.Icon>

          <UI.Button.Icon
            style="margin: 4px;"
            color="destructive"
            ghost
            on:click={async (ev) => {
              ev.stopPropagation();
              if (window.confirm(`Delete shift "${item.name}"?`)) {
                shiftSetup.update((setup) => {
                  return {
                    ...setup,
                    shifts: [
                      ...setup.shifts.slice(0, index),
                      ...setup.shifts.slice(index + 1),
                    ],
                  };
                });
              }
            }}
          >
            <DeleteOutline />
          </UI.Button.Icon>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .shift-table tr > *:nth-child(2) {
    width: 4.5em;
    color: var(--shift-color);
    text-shadow: 0.1em 0.1em 0.1em hsl(var(--border));
  }

  .shift-table tr > *:nth-child(3) {
    width: calc(6em + (4px * 4) + (var(--spacing) * 2));
  }
</style>
