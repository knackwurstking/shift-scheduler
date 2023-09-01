<script>
    import EditModeItem from "./EditModeItem.svelte";

    /** @type {ShiftItem[]} */
    let shiftItems = [
        { name: "Early", visible: true },
        { name: "Late", visible: true },
        { name: "Night", visible: true },
        { name: "Free", visible: false },
    ];
</script>

<section class="shift-start-date">
  <form action="#">
    <input type="date" class="shift-start-date" />
  </form>
</section>

<section class="shift-rhythm">
  <form action="#">
    <input type="text" class="shift-start-date" />
  </form>
</section>

<section class="shift-list-edit-mode">
  <form action="#">
    <ul class="shift-edit-mode">
        {#each shiftItems as item}
            <EditModeItem
                {...item}
            />
        {/each}
    </ul>
  </form>
</section>

<style>
</style>
