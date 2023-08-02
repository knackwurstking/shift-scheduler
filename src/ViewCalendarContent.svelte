<script>
    /** @type {number} */
    export let monthCount;
</script>

<div class="grid">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>

<style>
    div.grid {
        width: 100%;
        height: 100%;

        grid-template-columns: auto auto auto auto auto auto auto;
        grid-template-rows: auto auto auto auto auto auto auto;

        grid-column-gap: var(--spacing);
        grid-row-gap: var(--spacing);

        padding: var(--spacing) 0;
    }

    div.grid > div {
        border: 1px solid;
        border-radius: var(--border-radius);
    }
</style>