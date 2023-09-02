<script>
    // @ts-ignore
    import FaEdit from 'svelte-icons/fa/FaEdit.svelte'

    import Shift from "./Shift.svelte";
    import ShiftAdd from "./ShiftAdd.svelte";
    import DialogAddShift from './DialogAddShift.svelte';
    import DialogEditShift from './DialogEditShift.svelte';
    import IconButton from "../icon-button/IconButton.svelte";

    let { shiftEditItems, startDate, shiftRhythm } = getSettings();
    $: !!shiftEditItems && (save());
    $: !!startDate && (save());
    $: !!shiftRhythm && (save());

    let dialogAddShift = false;
    let dialogEditShift = false;

    /**
     * @returns {{
     *  shiftEditItems: ShiftItem[],
     *  startDate: string,
     *  shiftRhythm: ShiftName[],
     * }}
     */
    function getSettings() {
        const settings = JSON.parse(localStorage.getItem("settings") || "{}");

        // NOTE: default values for testing
        settings.shiftEditItems = settings.shiftEditItems || [];
        settings.startDate = settings.startDate || "";
        settings.shiftRhythm = settings.shiftRhythm || [];

        return settings;
    }

    function save() {
        console.debug("save...");

        localStorage.setItem("settings", JSON.stringify({
            shiftEditItems,
            startDate,
            shiftRhythm,
        }))
    }
</script>

{#if dialogAddShift}
    <DialogAddShift
        open={dialogAddShift}
        on:submit={({ detail }) => {
            console.debug("DialogAddShift (submit):", detail);
            // TODO: add shift (detail: ShiftName)

            dialogAddShift = false;
        }}
    />
{/if}

{#if dialogEditShift}
    <DialogEditShift
        open={dialogEditShift}
        on:submit={({ detail }) => {
            console.debug("DialogEditShift (submit):", detail);
            // TODO: new shifts list (detail: ShiftName[])

            dialogEditShift = false;
        }}
    />
{/if}

<section class="shifts">
    <form action="#">
        <label for="start-date">
            Start Date
            <input type="date" name="start-date" class="shift-start-date" bind:value={startDate} />
        </label>

        <div class="shifts">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Shifts (Edit)</label>

            <div class="actions" style="float: right;">
                <IconButton on:click={() => (dialogEditShift = true)}><FaEdit /></IconButton>
            </div>

            <ul class="shifts-available">
                {#each shiftEditItems as item}
                    <Shift {...item} on:click={() => {
                        shiftRhythm = [
                            ...shiftRhythm,
                            item.name,
                        ];
                    }} />
                {/each}

                <ShiftAdd on:click={() => (dialogAddShift = true)} />
            </ul>
        </div>

        <div class="rhythm">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Rhythm (click a item from <i>"Shifts (Edit)"</i> to add)</label>

            <ul>
                {#each shiftRhythm as shift, index}
                    <Shift
                        {...(shiftEditItems.find(s => s.name === shift) || { name: shift, visible: true })}
                        on:click={() => {
                            shiftRhythm = [
                                ...shiftRhythm.slice(0, index),
                                ...shiftRhythm.slice(index+1),
                            ];
                        }}
                    />
                {/each}
            </ul>
        </div>
    </form>
</section>

<style>
    section:first-child {
        margin-top: var(--spacing);
    }
</style>
