<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {boolean} */
  export let open;

  /** @type {number} */
  export let year;
  /** @type {number} */
  export let month;
  $: year && month && (date = `${year}-${month}`);

  /** @type {string} */
  let date; 
  /** @type {boolean} */
  let invalid = false;

  // TODO: handle invalid
</script>

<dialog class="date-picker--dialog" {open}>
  <article>
    <label>
      Year and Month (format: `YYYY-MM`)
      <input type="month" bind:value={date} />
    </label>

    <button type="submit" on:click={() => {
      let year;
      let month;

      try {
        year = parseInt(date.split("-")[0], 10);
        month = parseInt(date.split("-")[1], 10);

        if (isNaN(year) || isNaN(month)) {
          invalid = true;
          return
        }

        if (month <= 0 && month >= 11) {
          invalid = true;
          return;
        }
      } catch {
        invalid = true;
        return;
      }

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
