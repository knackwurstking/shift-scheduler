<script>
  import Shift from "./Shift.svelte";
  import AddShift from "./AddShift.svelte";

  let { shiftEditItems, startDate, shiftRhythm } = getSettings();
  $: console.debug({ shiftEditItems, startDate, shiftRhythm });

  /**
   * @returns {{
   *  shiftEditItems: ShiftItem[],
   *  startDate: string,
   *  shiftRhythm: ShiftName[],
   * }}
   */
  function getSettings() {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");

    // NOTE: default values for testing
    settings.shiftEditItems = settings.shiftEditItems || [
      { name: "Early", shortName: "F", visible: true },
      { name: "Late", shortName: "S", visible: true },
      { name: "Night", shortName: "N", visible: true },
      { name: "-", visible: false },
    ];
    settings.startDate = settings.startDate || "";
    settings.shiftRhythm = settings.shiftRhythm || [];

    return settings;
  }
</script>

<section class="shifts">
  <form action="#">
    <label for="start-date">
      Start Date
      <input type="date" name="start-date" class="shift-start-date" bind:value={startDate} />
    </label>

    <div class="shifts">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>Shifts (Edit)</label>

      <ul class="shifts-available">
        {#each shiftEditItems as item}
          <Shift {...item} on:click={() => {
            shiftRhythm = [
              ...shiftRhythm,
              item.name,
            ];
          }} />
        {/each}
        <AddShift on:click={() => {
          // TODO: add a new shift (open dialog)
        }} />
      </ul>
    </div>

    <div class="rhythm">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>Rhythm (click a item from <i>"Shifts (Edit)"</i> to add)</label>

      <ul>
        {#each shiftRhythm as shift, index}
          <Shift {...(shiftEditItems.find(s => s.name === shift) || { name: shift, visible: true })} on:click={() => {
            shiftRhythm = [
              ...shiftRhythm.slice(0, index),
              ...shiftRhythm.slice(index+1),
            ];
          }} />
        {/each}
      </ul>
    </div>
  </form>
</section>

<style>
  section:first-child {
    margin-top: var(--spacing);
  }
</style>
