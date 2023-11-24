<script>
    /** @type {number} */
    export let year;
</script>

<div>
    <h2
        style={
            "position: absolute;" +
            "top: var(--spacing);" +
            "right: var(--spacing);"
        }
    >{year}</h2>

    <slot />
</div>

<style>
    div {
        width: 100%;
        aspect-ratio: 1 / 1.414;
    }
</style>
