<script>
  import { UI } from "ui";

  import { lang } from "../../lib/js";

  /** @type {import("../../lib/components").ShiftDialog} */
  export let shiftDialog;
</script>

<section>
  <UI.Button.Root
    class="is-max-width"
    on:click={async () => shiftDialog.open()}
  >
    {lang.get("view settings", "addShiftButton")}
  </UI.Button.Root>
</section>
