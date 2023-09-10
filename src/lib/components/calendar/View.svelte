<script>
    /** @type {number} */
    export let currentMonthCount;

    /** @type {Month[]} */
    let months = getMonths();

    function getMonths() {
        // TODO: return three months with day data?
    }
</script>

<div class="_container">
    {#each months as month}
        <div class="_month">
        </div>
    {/each}
</div>

<style>
    div._container {
    }

    div._month {
    }
</style>