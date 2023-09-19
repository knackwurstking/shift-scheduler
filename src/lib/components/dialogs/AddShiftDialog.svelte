<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

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

    <button class="secondary" on:click={() => dispatch("cancel")}>Cancel</button>

    <button
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
  dialog article {
  }

  dialog article > *:nth-child(4) {
    margin-top: var(--spacing);
  }

</style>
