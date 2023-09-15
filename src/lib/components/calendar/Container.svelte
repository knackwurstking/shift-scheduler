<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import * as ripple from "../../ripple";

  /**
   *
   * @param {Date} date
   */
  export function setCurrentDate(date) {
    currentDate = date;
  }

  export function reload() {
    currentDate = currentDate;
  }

  /** @type {[number, number, number]} */
  let items = [-1, 0, 1];
  /** @type {string} */
  let transition = "none";
  /** @type {string} */
  let currentTranslateX = "-100%";
  /** @type {"left" | "right" | null} */
  let direction = null;
  /** @type {boolean} */
  let pointerlock = false;
  /** @type {boolean} */
  let waitForTransition = false;
  /** @type {number | null} */
  let lastClientX = null;
  /** @type {Date} */
  let currentDate = new Date();
  /** @type {number} */
  let visibleChildIndex = 1;
  /** @type {number} */
  let startClientX = 0;
  /** @type {number} */
  let minSwipeRange;
  /** @type {number} */
  let directionChangeX;
  /** @type {HTMLDivElement} */
  let container;
  /** @type {number} */
  let currentTranslateX_px = 0;

  $: container && init();

  function init() {
    const visibleChild = container.children[visibleChildIndex];
    if (visibleChild) {
      container.onpointerdown = (ev) => {
        if (waitForTransition || pointerlock) return;

        transition = "none";
        startClientX = ev.clientX;
        //minSwipeRange = container.getBoundingClientRect().width / 5;
        minSwipeRange = 50;
      };

      container.onpointerup = () => {
        if (waitForTransition) return;

        if (pointerlock) {
          waitForTransition = true;
          transition = "transform 0.15s linear";

          if (direction === "left") {
            currentTranslateX = "-200%";
          } else if (direction === "right") {
            currentTranslateX = "0";
          } else {
            currentTranslateX = "-100%";
            resetTransition();
          }
        }
      };

      container.onpointercancel = container.onpointerup;

      container.onpointermove = (ev) => {
        if (waitForTransition) return;

        if (pointerlock && ev.buttons === 1) {
          const startDiff = startClientX - ev.clientX;

          if (ev.clientX < lastClientX && Math.abs(startDiff) > minSwipeRange) {
            // left swipe

            if (direction === "right") {
              // directon change from a right to a left swipe

              if (ev.clientX < startClientX) {
                direction = "left";
              }
            } else {
              direction = "left";
            }

            currentTranslateX_px -= 3;
          } else if (ev.clientX > lastClientX && Math.abs(startDiff) > minSwipeRange) {
            // right swipe

            if (direction === "left") {
              // direction change from a left to a right swipe

              if (ev.clientX > startClientX) {
                direction = "right";
              }
            } else {
              direction = "right";
            }

            currentTranslateX_px += 3;
          }

          currentTranslateX = `calc(-100% + ${currentTranslateX_px}px)`;
          lastClientX = ev.clientX;
          return;
        }

        if (ev.buttons !== 1) {
          if (pointerlock) container.onpointerup(ev);
          return;
        }

        if (!pointerlock) {
          if (startClientX - ev.clientX > 2 || startClientX - ev.clientX < -2) {
            pointerlock = true;
          }
          return;
        }
      };
    }
  }

  function resetTransition() {
    direction = null;
    lastClientX = null;
    pointerlock = false;
    currentTranslateX_px = 0;
    setTimeout(() => (waitForTransition = false), 100);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={container}
  on:click={(ev) => {
    if (waitForTransition || pointerlock) return;
    // @ts-ignore
    for (const el of ev?.path || ev.composedPath() || []) {
      if (el.classList?.contains("day-content")) {
        const date = parseInt(el.getAttribute("data-value"), 10);
        if (isNaN(date)) dispatch("click", null);
        else {
          ripple.add(ev, el);
          dispatch("click", new Date(currentDate.getFullYear(), currentDate.getMonth(), date));
        }
      }
    }
  }}
>
  {#each items as _item, index}
    <slot
      name="container-item"
      {index}
      currentDate={new Date(currentDate.getFullYear(), currentDate.getMonth() + (index - 1))}
      {currentTranslateX}
      {transition}
      transitionend={() => {
        if (direction === "left") {
          items = [items[1], items[2], items[0]];
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        } else if (direction === "right") {
          items = [items[2], items[0], items[1]];
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        }

        transition = "none";
        currentTranslateX = "-100%";

        resetTransition();
      }}
    />
  {/each}
</div>

<style>
  div {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    overflow: hidden;

    touch-action: none;
    user-select: none;
  }
</style>
