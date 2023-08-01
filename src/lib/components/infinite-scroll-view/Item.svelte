<script></script>

<section>
  <slot />
</section>

<style>
  section {
    width: 100%;

    min-height: 100%;
    height: 100%;
    max-height: 100%;

    border: 1px solid yellow;
  }

  section:nth-child(1) {
    scroll-snap-align: start;
  }

  section:nth-child(2) {
    scroll-snap-align: center;
  }

  section:nth-child(3) {
    scroll-snap-align: end;
  }
</style>
