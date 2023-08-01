<script>
  /** @type {HTMLElement} */
  let beforeSection;
  /** @type {HTMLElement} */
  let currentSection;
  /** @type {HTMLElement} */
  let afterSection;
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
        break;
    }
  }}
>
  <section bind:this={beforeSection} class="before">before</section>
  <section bind:this={currentSection} class="current">current</section>
  <section bind:this={afterSection} class="after">after</section>
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

  div > section {
    width: 100%;

    min-height: 100%;
    height: 100%;
    max-height: 100%;

    border: 1px solid yellow;
  }

  div > section:nth-child(1) {
    scroll-snap-align: start;
  }

  div > section:nth-child(2) {
    scroll-snap-align: center;
  }

  div > section:nth-child(3) {
    scroll-snap-align: end;
  }
</style>
