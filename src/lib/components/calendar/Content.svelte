<script>
    import DialogEditItem from "./DialogEditItem.svelte";

    import * as utils from "../../js/utils";

    /** @type {Date} */
    let today;

    /** @type {Date} */
    let date;
    $: !!date && updateData();

    /** @type {Settings} */
    let settings = JSON.parse(localStorage.getItem("settings") || "{}");
    $: {
        if (settings) {
            if (typeof settings.startDate === "string") {
                settings.startDate = new Date(settings.startDate);
            }
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

    /** @type {GridItem[]} */
    let items = [];

    let editItemDialogOpen = false;
    /** @type {GridItem} */
    let editItemDialogItem;
    /** @type {Date} */
    let editItemDialogDate;

    async function updateData() {
        /** @type {GridItem[]} */
        const nextItems = [];

        for (let x = 0; x < 42; x++) {
            const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (x - date.getDay()));

            nextItems.push({
                title: `${d.getDate()}`,
                disabled: d.getMonth() !== date.getMonth(),
                today: !!(
                    today.getFullYear() === d.getFullYear() &&
                    today.getMonth() === d.getMonth() &&
                    today.getDate() === d.getDate()
                ),
                data: d.getMonth() !== date.getMonth() ? null : await getData(d),
            });
        }

        items = nextItems;
    }

    /**
     *
     * @param {Date} date
     * @returns {Promise<GridItemData>}
     */
    async function getData(date) {
        return {
            default: await getDefault(date),
            shift: await getShift(date),
            note: await getNote(date),
        };
    }

    /**
     *
     * @param {Date} date
     * @returns {Promise<ShiftItem | null>}
     */
    async function getDefault(date) {
        if (!settings.startDate) return null;

        return utils.calcShiftStep(settings, date);
    }

    /**
     *
     * @param {Date} date
     * @returns {Promise<ShiftItem | null>}
     */
    async function getShift(date) {
        const shift = localStorage.getItem(`data-shift-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
        return !!shift ? JSON.parse(shift) : null;
    }

    /**
     *
     * @param {Date} date
     * @returns {Promise<string | null>}
     */
    async function getNote(date) {
        return localStorage.getItem(`data-note-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`) || null;
    }
</script>

{#if editItemDialogOpen}
    <DialogEditItem
        bind:open={editItemDialogOpen}
        date={editItemDialogDate}
        item={editItemDialogItem}
        {settings}
        on:submit={({ detail }) => {
            console.debug(detail);
            editItemDialogOpen = false;
            for (let i = 0; i < items.length; i++) {
                if (!items[i].disabled && parseInt(items[i].title, 10) === editItemDialogDate.getDate()) {
                    items[i].data = detail
                    return;
                }
            }
        }}
    />
{/if}

<div class="grid">
    <div class="header">Sun</div>
    <div class="header">Mon</div>
    <div class="header">Tue</div>
    <div class="header">Wen</div>
    <div class="header">Thu</div>
    <div class="header">Fri</div>
    <div class="header">Sat</div>

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#each items as item}
        <div
            class="item"
            class:disabled={!!item.disabled}
            class:today={!!item.today}
            on:click={!item.disabled
                ? () => {
                      editItemDialogOpen = true;
                      editItemDialogItem = item;
                      // NOTE: item.title will be the current date
                      editItemDialogDate = new Date(date.getFullYear(), date.getMonth(), parseInt(item.title, 10));
                  }
                : null}
        >
            <span class="date">{item.title}</span>

            {#if item.data?.note}
                <div class="note-marker" />
            {/if}

            {#if item.data?.shift}
                <span class="shift" class:visible={item.data.shift.visible}>{item.data.shift.shortName}</span>
            {:else if item.data?.default}
                <span class="shift" class:visible={item.data.default.visible}>{item.data.default.shortName}</span>
            {/if}
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
        position: relative;
        user-select: none;
        overflow: hidden;
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

        text-decoration: underline;

        font-size: 0.9em;
    }

    .grid .item .note-marker {
        position: absolute;
        right: -0.8rem;
        bottom: -0.8rem;
        width: 1.5rem;
        height: 1.5rem;
        background-color: red;
        transform: rotate(45deg);
    }

    .grid .item .shift {
        position: absolute;

        font-size: 1em;

        top: calc(50% - 0.5em);
        left: 4px;
        width: calc(100% - 8px);

        text-align: center;
        text-overflow: ellipsis;

        font-weight: bold;

        border: none;
        border-radius: var(--border-radius);
    }

    .grid .item .shift:not(.visible) {
        display: none;
    }
</style>
