<script>
  import Dialog from "./Dialog.svelte";

  /** @type {DatePickerCurrent} */
  export let current;

  let picker = false;
</script>

{#if picker}
  <Dialog
    open={true}
    month={current.month}
    year={current.year}
    on:submit={(ev) => {
      current = {
        year: ev.detail?.year || current.year,
        month: ev.detail?.month || current.month,
      };
      picker = false;
    }}
  />
{/if}

<button
  class="date-picker--preview outline"
  on:click={() => {
    // TODO: open dialog for changing the current year and month in use
  }}
>
  <span
    >{current.year || "YYYY"} / {(current.month || "MM")
      .toString()
      .padStart(2, "0")}</span
  >
</button>

<style>
  div.date-picker--preview {
  }

  div.date-picker--preview span {
  }
</style>
