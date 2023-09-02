<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import IoIosAdd from 'svelte-icons/io/IoIosAdd.svelte'
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card" on:click={() => dispatch("click")}>
  <span>
    <IoIosAdd />
  </span>
</div>

<style>
  div.card {
    display: inline-block;

    overflow: hidden;

    border: 1px solid var(--muted-border-color);
    border-radius: var(--border-radius);

    height: calc(3em + 16px);
    width: calc(6em + 16px);
    padding: 8px;
    margin: 4px;
  }

  div.card span {
    filter: opacity(0.45);
  }
</style>
