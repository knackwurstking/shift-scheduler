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
    {lang.get()["settings shifts"]["button new shift"]}
  </UI.Button.Root>
</section>
