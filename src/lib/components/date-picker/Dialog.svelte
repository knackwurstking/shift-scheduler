<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import * as utils from "../../js/utils";

  /** @type {boolean} */
  export let open;

  /** @type {number} */
  export let year;
  /** @type {number} */
  export let month;
  $: year && month && setDate();

  /** @type {string} */
  let date; 
  /** @type {boolean} */
  let invalidYear = false;
  /** @type {boolean} */
  let invalidMonth = false;

  function setDate() {
    date = `${year}-${month}`;
  }
</script>

<dialog class="date-picker--dialog" {open}>
  <article>
    {#if utils.isAndroid()}
      <label>
        <input type="month" bind:value={date} />
      </label>
    {:else}
      <div>
        <label>
          Year
          <input
            type="number"
            bind:value={year}
            aria-invalid={invalidYear}
            on:input={() => {
              if (year === null) {
                invalidYear = true;
              } else {
                invalidYear = false;
              }
            }}
          />
        </label>
        <label>
          Month
          <input
            type="number"
            min={1}
            max={12}
            bind:value={month}
            aria-invalid={invalidMonth}
            on:input={() => {
              if ((month < 1 || month > 12) || month === null) {
                invalidMonth = true;
              } else {
                invalidMonth = false;
              }
            }}
          />
        </label>
      </div>
    {/if}

    <button class="secondary" on:click={() => dispatch("cancel")}>Cancel</button>

    <button type="submit" on:click={() => {
      if (invalidMonth || invalidYear) return;
      dispatch("submit", { year, month });
    }}>
      OK
    </button>
  </article>
</dialog>

<style>
  dialog {
    width: 100%;
    height: 100%;
  }

  dialog article {
    padding: var(--spacing);
  }
</style>
