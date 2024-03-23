<script>
  import { ShiftDialog, EditRhythmDialog } from "../../lib/components";

  import { lang } from "../../lib/js";
  import * as Store from "../../lib/stores";

  import ShiftSettingsTable from "./ShiftSettingsTable.svelte";
  import ShiftSettingsAdd from "./ShiftSettingsAdd.svelte";
  import ShiftSettingsStartDate from "./ShiftSettingsStartDate.svelte";
  import ShiftSettingsRhythm from "./ShiftSettingsRhythm.svelte";

  const shiftSetup = Store.ShiftSetup.create();

  /** @type {ShiftDialog} */
  let shiftDialog;

  /** @type {EditRhythmDialog} */
  let editRhythmDialog;
</script>

<article class="ui-card has-margin">
  <section>
    <h3>{lang.get()["settings shifts"]["title"]}</h3>

    <hr />

    <figure class="is-max-width">
      <ShiftSettingsTable {shiftDialog} />
    </figure>
  </section>

  <ShiftSettingsAdd {shiftDialog} />
  <hr />
  <ShiftSettingsStartDate />
  <hr />
  <ShiftSettingsRhythm {editRhythmDialog} />
</article>

<EditRhythmDialog
  bind:this={editRhythmDialog}
  on:close={async () => editRhythmDialog.close()}
  on:submit={async ({ detail }) => {
    editRhythmDialog.close();
    shiftSetup.updateRhythm(detail);
  }}
/>

<ShiftDialog
  bind:this={shiftDialog}
  on:close={async () => shiftDialog.close()}
  on:submit={async (ev) => {
    shiftDialog.close();

    /** @type {_Shift} */
    const shift = ev.detail;

    if (!shift.name) return;

    if (shift.id) shiftSetup.updateShift(shift);
    else
      shiftSetup.update((setup) => {
        shift.id = new Date().getTime();
        return {
          ...setup,
          shifts: [...setup.shifts, shift],
        };
      });
  }}
/>
