<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import * as ripple from "../../ripple";

  /** @type {string} */
  export let name;
  /** @type {string} */
  export let shortName = "";
  /** @type {boolean} */
  export let visible = true;
  /** @type {string} */
  export let color = "var(--color)";

  export let active = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="card"
  class:active
  style={`color: ${color};`}
  on:click={(ev) => {
    ripple.add(ev, ev.currentTarget, { mode: "primary" });
    dispatch("click");
  }}
>
  <span class="name">{name}</span><br />
  <span class="short-name" class:visible>{shortName || name[0]}</span>
</div>

<style>
  div.card {
    position: relative;
    overflow: hidden;

    display: inline-block;

    border: 1px solid var(--muted-border-color);
    border-radius: var(--border-radius);

    height: calc(3em + 16px);
    width: calc(4.75em + 16px);
    padding: 8px;
    margin: 2px;

    user-select: none;
  }

  div.card.active {
    border-color: var(--primary);
  }

  div.card span.name {
    display: inline-block;
    font-size: 0.95em;
    font-weight: 400;
    text-overflow: ellipsis;
  }

  div.card span.short-name {
    display: inline-block;
    font-size: 0.8em;
    font-weight: 400;
    font-style: italic;
    text-overflow: ellipsis;
  }

  div.card span.short-name:not(.visible) {
    display: none;
  }
</style>
