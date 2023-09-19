<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let _class = "";
  export { _class as class };

  import * as ripple from "../../ripple";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
  class={"contrast outline icon-button " + _class}
  {...$$restProps}
  on:pointerdown={(ev) => {
    if (ev.buttons === 1) {
      ripple.add(ev, ev.currentTarget);
    }
  }}
  on:click={(ev) => {
    dispatch("click");
  }}
>
  <slot />
</button>

<style>
  .icon-button {
    position: relative;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    --ripple-color: var(--color);
    color: var(--color);

    height: 32px;
    width: 32px;

    padding: 2px 4px;
    margin: 8px;

    border-radius: 50%;
    border: none;
    box-shadow: none;
  }
</style>
