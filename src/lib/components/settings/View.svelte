<script>
  import EditModeItem from "./EditModeItem.svelte";

  let { shiftEditItems, startDate, shiftRhythm } = getSettings();
  $: console.debug("Start Date:", startDate);

  /**
   * @returns {{
   *  shiftEditItems: ShiftItem[],
   *  startDate: Date,
   *  shiftRhythm: ShiftName[],
   * }}
   */
  function getSettings() {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    settings.shiftEditItems = [];
    settings.startDate = new Date(settings.date || null);
    settings.shiftRhythm = [];
    return settings;
  }
</script>

<section class="shift-start-date">
  <form action="#">
    <input type="date" class="shift-start-date" bind:value={startDate} />
  </form>
</section>

<section class="shift-rhythm">
  <form action="#">
    <input type="text" class="shift-start-date" bind:value={shiftRhythm} />
  </form>
</section>

<section class="shift-list-edit-mode">
  <form action="#">
    <ul class="shift-edit-mode">
      {#each shiftEditItems as item}
        <EditModeItem {...item} />
      {/each}
    </ul>
  </form>
</section>

<style>
</style>
