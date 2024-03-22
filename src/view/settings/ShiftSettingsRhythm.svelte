<script>
  import { UI } from "ui";

  import { lang } from "../../lib/js";
  import * as Store from "../../lib/stores";

  const shiftSetup = Store.ShiftSetup.create();

  /** @type {import("../../lib/components").EditRhythmDialog} */
  export let editRhythmDialog;
</script>

<section>
  <UI.Text.Label primary={lang.get("view settings", "rhythmPrimaryText")} row>
    <UI.Button.Root
      disabled={!$shiftSetup.shifts.length}
      on:click={async () => {
        editRhythmDialog.open(
          $shiftSetup.shifts,
          $shiftSetup.rhythm.filter(
            (id) => !!$shiftSetup.shifts.find((s) => s.id === id),
          ),
        );
      }}
    >
      {lang.get("buttons", "edit")}
    </UI.Button.Root>
  </UI.Text.Label>
</section>
