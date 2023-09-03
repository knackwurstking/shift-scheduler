<script>
  /** @type {Date} */
  let today;

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
      today = new Date();
      date = new Date(today.getFullYear(), today.getMonth() + monthCount, 1);
    }
  }

  /** @type {GridItemData[]} */
  let data = [];

  function updateData() {
    console.debug("update date:", date);

    /** @type {GridItemData[]} */
    const nextData = [];

    for (let x = 0; x < 42; x++) {
      const d = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + (x - date.getDay())
      );
      nextData.push({
        title: `${d.getDate()}`,
        disabled: d.getMonth() !== date.getMonth(),
        today: !!(
          today.getFullYear() === d.getFullYear() &&
          today.getMonth() === d.getMonth() &&
          today.getDate() === d.getDate()
        ),
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
    <div
      class="item"
      class:disabled={!!itemData.disabled}
      class:today={!!itemData.today}
    >
      <span class="date">{itemData.title}</span>
    </div>
  {/each}
</div>

<style>
  .grid {
    width: 100%;
    height: 100%;

    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1.5rem 1fr 1fr 1fr 1fr 1fr 1fr;

    grid-column-gap: 4px;
    grid-row-gap: 4px;

    padding: var(--spacing) 0;
  }

  .grid > div {
    border: 1px solid var(--muted-border-color);
    border-radius: var(--border-radius);
  }

  .grid > .header {
    display: flex;
    font-size: 1.25rem;
    font-weight: bold;
    justify-content: center;
    align-items: flex-end;
    border: none;
  }

  .grid .item {
    user-select: none;
  }

  .grid .item.today {
    color: orange;
  }

  .grid .item.disabled {
    opacity: 0.7;
    filter: blur(1px);
  }

  .grid .item .date {
    margin-left: calc(var(--spacing) / 2);
  }
</style>
