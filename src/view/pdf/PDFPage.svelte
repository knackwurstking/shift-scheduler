<script>
  /** @type {number} */
  export let year;
</script>

<div class="page">
  <h2
    style={"position: absolute;" +
      "top: var(--spacing);" +
      "right: var(--spacing);"}
  >
    {year}
  </h2>

  <slot />
</div>

<style>
  div {
    width: 100%;
  }
</style>
