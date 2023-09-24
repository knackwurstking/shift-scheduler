<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { ripple } from "../../js/ripple";
  let _ripple = ripple({ usePointer: true });

  let name = "";
  let shortName = "";
  let hidden = false;
  let color;
</script>

<dialog open>
  <article>
    <label for="name">
      Shift Name
      <input type="text" name="name" bind:value={name} />
    </label>

    <label for="shortName">
      Short Shift Name
      <input type="text" name="shortName" bind:value={shortName} />
    </label>

    <label for="hidden">
      <input type="checkbox" name="hidden" bind:checked={hidden} />
      Hidden Shift (Not visible in calendar)
    </label>

    <label for="color">
      Color
      <input type="color" name="color" bind:value={color} />
    </label>

    <button
      class="secondary"
      use:_ripple
      on:click={() => dispatch("cancel")}
    >
      Cancel
    </button>

    <button
      use:_ripple
      on:click={() =>
        dispatch("submit", {
          name,
          shortName: shortName || name[0] || "",
          color: color,
          visible: !hidden,
        })}
    >
      OK
    </button>
  </article>
</dialog>

<style>
  dialog article > *:nth-child(4) {
    margin-top: var(--spacing);
  }

</style>
