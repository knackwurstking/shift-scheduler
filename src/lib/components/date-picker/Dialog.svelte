<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import * as utils from "../../js/utils";
  import { ripple } from "../../js/ripple";
  let _ripple = ripple({ usePointer: true });

  /** @type {boolean} */
  export let open;

  /** @type {number} */
  export let year;
  /** @type {number} */
  export let month;

  /** @type {string} */
  let date; 
  /** @type {boolean} */
  let invalidYear = false;
  /** @type {boolean} */
  let invalidMonth = false;

  $: !date && year && month && setDate();
  $: date && parseDate();

  function setDate() {
    date = `${year}-${month}`;
  }

  function parseDate() {
    const [y, m] = date.split("-", 2);
    year = parseInt(y, 10);
    month = parseInt(m, 10);
  }
</script>

<dialog class="date-picker--dialog" {open}>
  <article>
    {#if utils.isAndroid()}
      <label>
        Pick a Date
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

    <button
      class="secondary"
      use:_ripple
      on:click={() => dispatch("cancel")}
    >
      Cancel
    </button>

    <button
      type="submit"
      use:_ripple
      on:click={() => {
        if (invalidMonth || invalidYear) return;
        dispatch("submit", { year, month });
      }}
    >
      OK
    </button>
  </article>
</dialog>

<style>
  dialog article {
    /* Need to set a width */
    padding: var(--spacing);
    width: 100%;
  }
</style>
