<script>
    /** @type {number} */
    export let monthCount;
</script>

<div class="grid">
    <div class="header">Sun</div>
    <div class="header">Mon</div>
    <div class="header">Tue</div>
    <div class="header">Wen</div>
    <div class="header">Thu</div>
    <div class="header">Fri</div>
    <div class="header">Sat</div>

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

        /* TODO: grid item sizing evenly */
        grid-template-columns: auto auto auto auto auto auto auto;
        grid-template-rows: 1.5rem auto auto auto auto auto auto;

        grid-column-gap: 4px;
        grid-row-gap: 4px;

        padding: var(--spacing) 0;
    }

    div.grid > div {
        border: 1px solid var(--muted-border-color);
        border-radius: var(--border-radius);
    }

    div.grid > div.header {
        display: flex;
        font-size: 1.25rem;
        font-weight: bold;
        justify-content: center;
        align-items: center;
    }
</style>