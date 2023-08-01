<script>
  /** @type {DatePickerCurrent} */
  export let current;
</script>

<!-- TODO: Date picker for selecting the current month and year -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="date-picker--preview"
  role="button"
  tabindex="0"
  on:click={() => {
    // TODO: open dialog for changing the current year and month in use
  }}
>
  <span>{current.year || "YYYY"} / {(current.month || "MM").toString().padStart(2, "0")}</span>
</div>

<style>
  div.date-picker--preview {
  }

  div.date-picker--preview span {
  }
</style>