<script>
  import Shift from "./Shift.svelte";

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
    settings.shiftRhythm = settings.shiftRhythm || ["Early", "Early", "Late", "Late", "Night", "Night", "-", "-", "-"];

    return settings;
  }
</script>

<section class="shifts">
  <form action="#">
    <label for="start-date">
      Start Date
      <input type="date" name="start-date" class="shift-start-date" bind:value={startDate} />
    </label>

    <div class="rhythm">
      <!-- TODO: add some action button (to the right) for adding? a shift? -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>Rhythm</label>

      <ul>
        {#each shiftRhythm as shift}
          <Shift {...(shiftEditItems.find(s => s.name === shift) || { name: shift, visible: true })} on:click={() => {
            // TODO: remove this shift from the shift rhythm
          }} />
        {/each}
      </ul>
    </div>

    <div class="shifts">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label>Shifts (Edit)</label>

      <!-- TODO: add some separate `Shift` item for "Add +" a new shift -->
      <ul class="shifts-available">
        {#each shiftEditItems as item}
          <Shift {...item} on:click={() => {
            // TODO: Open edit dialog (remove shift from list, change name or short name, toggle visibility)
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
