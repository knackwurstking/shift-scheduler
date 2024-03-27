<script>
  /** @type {number} */
  export let year;
</script>

<div class="page is-max-width" style:aspectRatio="1 / 1.414">
  <h2
    style={"position: absolute;" +
      "top: var(--spacing);" +
      "right: var(--spacing);"}
  >
    {year}
  </h2>

  <slot />
</div>
