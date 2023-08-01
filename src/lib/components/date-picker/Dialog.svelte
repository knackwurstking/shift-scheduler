<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {boolean} */
  export let open;

  /** @type {number} */
  export let year;
  /** @type {number} */
  export let month;
</script>

<dialog class="date-picker--dialog" {open}>
  <form action="#">
    <!-- TODO: input field for "year" and "month" (required) -->

    <button type="submit" on:click={() => dispatch("submit", { year, month })}
      >OK</button
    >
  </form>
</dialog>
