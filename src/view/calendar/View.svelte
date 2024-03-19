<script>
  import { createEventDispatcher } from "svelte";

  import SwipeHandler from "./SwipeHandler.svelte";
  import Container from "./Container.svelte";
  import Content from "./Content.svelte";

  const dispatch = createEventDispatcher();

  /** @type {Date} */
  export let currentDate;

  /** @type {SwipeHandler} */
  let swipeHandler;

  /**
   * Trigger a calendar reload after a database update
   */
  export function reload() {
    swipeHandler.reload();
  }

  /**
   * @param {string} selector
   */
  export function querySelector(selector) {
    return swipeHandler.querySelector(selector);
  }
</script>

<SwipeHandler
  bind:this={swipeHandler}
  bind:currentDate
  on:click={(ev) => {
    dispatch("click", ev.detail);
  }}
>
  <Container
    slot="item"
    style={`
            transform: translateX(${currentTranslateX});
            transition: ${transition || "none"};
            will-change: transform;
        `}
    let:index
    let:currentDate
    let:currentTranslateX
    let:transition
    let:onTransformEnd
    on:transformend={() => onTransformEnd()}
  >
    <Content
      {index}
      {currentDate}
      on:currentdatechange={(ev) => {
        dispatch("currentdatechange", ev.detail);
      }}
    />
  </Container>
</SwipeHandler>
