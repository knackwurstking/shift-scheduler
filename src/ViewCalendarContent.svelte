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
        /* NOTE: 1.25rem === --font-size for a h3 tag */
        grid-template-rows: calc(1.25rem + (var(--spacing) * 2)) auto auto auto auto auto auto;

        grid-column-gap: 1px;
        grid-row-gap: 1px;

        background: var(--muted-border-color);
        padding: 1px;
    }

    div.grid > div {
        /* TODO: Fix double borders (set grid background to white? and the items background to black?) */
        border-radius: var(--border-radius);
        background: var(--background-color);
    }
</style>