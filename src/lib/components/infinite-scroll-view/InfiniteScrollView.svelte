<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import Item from "./Item.svelte";

  const slotsOrder = [0, 1, 2];
</script>

<!-- TODO: tree containers (divs), visible view will always be the second one, on scroll(end) reorder divs -->
<div
  on:scroll={(ev) => {
    // NOTE: This won't work if a border is set for this div
    let cs = window.getComputedStyle(ev.currentTarget);
    const borderWidth =
      parseInt(cs.borderTopWidth, 10) + parseInt(cs.borderBottomWidth, 10);

    cs = window.getComputedStyle(ev.currentTarget.children[0]);
    const sectionMargin =
      parseInt(cs.marginTop, 10) + parseInt(cs.marginBottom, 10);

    const rect = ev.currentTarget.getBoundingClientRect();

    switch (ev.currentTarget.scrollTop) {
      case 0:
        console.debug("scroll position: before");
        break;
      case rect.height + sectionMargin - borderWidth:
        console.debug("scroll position: current");
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
  <Item><slot name="0"></slot></Item>
  <Item><slot name="1"></slot></Item>
  <Item><slot name="2"></slot></Item>
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
