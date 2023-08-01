<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import Item from "./Item.svelte";

  let rect;

  /** @type {HTMLElement} */
  let container;
  $: {
    if (container) {
      rect = container.getBoundingClientRect();

      let cs = window.getComputedStyle(container);
      const borderWidth =
        parseInt(cs.borderTopWidth, 10) + parseInt(cs.borderBottomWidth, 10);

      cs = window.getComputedStyle(container.children[0]);
      const sectionMargin =
        parseInt(cs.marginTop, 10) + parseInt(cs.marginBottom, 10);

      container.scrollTop = rect.height + sectionMargin - borderWidth;
    }
  }

  const slotsOrder = [0, 1, 2];
</script>

<!-- TODO: initial positioning: second slot should be first
      case rect.height + sectionMargin - borderWidth:
        console.debug("scroll position: current");
        break;
-->
<div
  bind:this={container}
  on:scroll={(ev) => {
    // NOTE: This won't work if a border is set for this div
    let cs = window.getComputedStyle(ev.currentTarget);
    const borderWidth =
      parseInt(cs.borderTopWidth, 10) + parseInt(cs.borderBottomWidth, 10);

    cs = window.getComputedStyle(ev.currentTarget.children[0]);
    const sectionMargin =
      parseInt(cs.marginTop, 10) + parseInt(cs.marginBottom, 10);

    switch (ev.currentTarget.scrollTop) {
      case 0:
        console.debug("scroll position: before");
        // TODO: last child becomes the first child ("scrollup" event)
        break;
      case (rect.height + sectionMargin - borderWidth) * 2:
        console.debug("scroll position: after");
        ev.currentTarget.appendChild(
          ev.currentTarget.removeChild(ev.currentTarget.children[0])
        );
        slotsOrder.push(slotsOrder.shift());
        dispatch("scrolldown", { slotsOrder: slotsOrder });
        break;
    }
  }}
>
  <Item><slot name="0" /></Item>
  <Item><slot name="1" /></Item>
  <Item><slot name="2" /></Item>
</div>

<style>
  div {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    overflow-y: scroll;

    scroll-snap-type: y mandatory;

    /*
    border: 1px solid red;
    */
  }
</style>
