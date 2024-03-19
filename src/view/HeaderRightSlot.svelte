<script>
  import FilePdfBox from "svelte-material-icons/FilePdfBox.svelte";
  import Pencil from "svelte-material-icons/Pencil.svelte";
  import CalendarToday from "svelte-material-icons/CalendarToday.svelte";
  import Wrench from "svelte-material-icons/Wrench.svelte";

  import { createEventDispatcher } from "svelte";
  import { UI } from "ui";

  const dispatch = createEventDispatcher();

  /** @type {Date} */
  export let currentDate;

  export let datePicker = false;
</script>

{#if datePicker}
  <UI.Button.Icon ghost on:click={() => dispatch("goto", "pdf")}>
    <FilePdfBox />
  </UI.Button.Icon>

  <UI.Button.Icon ghost on:click={() => dispatch("editmodeclick")}>
    <Pencil />
  </UI.Button.Icon>

  <UI.Button.Icon
    ghost
    disabled={(() => {
      const today = new Date();
      return (
        today.getFullYear() === currentDate.getFullYear() &&
        today.getMonth() === currentDate.getMonth()
      );
    })()}
    on:click={() => dispatch("currentdatechange", new Date())}
  >
    <CalendarToday />
  </UI.Button.Icon>

  <UI.Button.Icon ghost on:click={() => dispatch("goto", "settings")}>
    <Wrench />
  </UI.Button.Icon>
{/if}
