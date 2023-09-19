<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /** @type {import("../settings").Shift[]} */
  export let shifts = [];

  /** @type {string} */
  export let selected = "0";

  let hidden = !shifts[selected].visible;
  $: typeof hidden === "boolean" && updateVisible();

  function updateVisible() {
    shifts[parseInt(selected)].visible = !hidden
  }
</script>

<dialog open>
  <article>
    <select name="shiftsToEdit" bind:value={selected}>
      {#each shifts as shift, index}
        <option value={index.toString()} selected={parseInt(selected) === index}
          >{shift.name}</option
        >
      {/each}
    </select>

    <label for="name">
      Name
      <input
        type="text"
        name="name"
        bind:value={shifts[parseInt(selected)].name}
      />
    </label>

    <label for="shortName">
      ShortName
      <input
        type="text"
        name="shortName"
        bind:value={shifts[parseInt(selected)].shortName}
      />
    </label>

    <label for="color">
      Color
      <input
        type="color"
        name="color"
        bind:value={shifts[parseInt(selected)].color}
      />
    </label>

    <label for="hidden">
      <input type="checkbox" name="hidden" bind:checked={hidden} />
      Hidden Shift (Not visible in calendar)
    </label>

    <button
      class="secondary"
      on:click={() => {
        if (window.confirm(`Delete "${shifts[parseInt(selected)].name}"?`)) {
          if (shifts.length <= 1) dispatch("submit", []);
          shifts = [
            ...shifts.slice(0, parseInt(selected)),
            ...shifts.slice(parseInt(selected) + 1),
          ];
          selected = "0";
        }
      }}>Delete</button
    >

    <button on:click={() => dispatch("submit", shifts)}>OK</button>
  </article>
</dialog>

<style>
  label {
    user-select: none;
  }

  article > *:nth-child(6) {
    margin-top: var(--spacing);
  }
</style>
