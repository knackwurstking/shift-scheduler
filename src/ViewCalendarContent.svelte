<script>
    /** @type {Date} */
    let date;
    $: {
        if (!!date) {
            updateData();
        }
    }

    /** @type {number} */
    export let monthCount;
    $: {
        if (typeof monthCount === "number") {
            const today = new Date();
            date = new Date(
                today.getFullYear(),
                today.getMonth() + monthCount,
                1
            );
        }
    }

    /** @type {GridItemData[]} */
    let data = [];

    function updateData() {
        // TODO: get data for the year and month
        // TODO: build the data grid
        /** @type {GridItemData[]} */
        const nextData = [];
        for (let x = 0; x < 42; x++) {
            const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (x - date.getDay()));
            nextData.push({
                title: `${d.getDate()}`,
            });
        }
        data = nextData;
    }
</script>

<div class="grid">
    <div class="header">Sun</div>
    <div class="header">Mon</div>
    <div class="header">Tue</div>
    <div class="header">Wen</div>
    <div class="header">Thu</div>
    <div class="header">Fri</div>
    <div class="header">Sat</div>

    {#each data as itemData}
        <div>
            <span>{itemData.title}</span>
        </div>
    {/each}
</div>

<style>
    div.grid {
        width: 100%;
        height: 100%;

        /* TODO: grid item sizing evenly */
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1.5rem 1fr 1fr 1fr 1fr 1fr 1fr;

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
