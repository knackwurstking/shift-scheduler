<script>
    // @ts-ignore
    import FaEdit from 'svelte-icons/fa/FaEdit.svelte'

    import Shift from "./Shift.svelte";
    import ShiftAdd from "./ShiftAdd.svelte";
    import DialogAddShift from './DialogAddShift.svelte';
    import DialogEditShift from './DialogEditShift.svelte';
    import IconButton from "../icon-button/IconButton.svelte";

    let { shifts, startDate, shiftRhythm } = getSettings();
    $: !!shifts && (save());
    $: (typeof startDate === "string") && (save());
    $: !!shiftRhythm && (save());

    let dialogAddShift = false;
    let dialogEditShift = false;

    /**
     * @returns {{
     *  shifts: ShiftItem[],
     *  startDate: string,
     *  shiftRhythm: ShiftName[],
     * }}
     */
    function getSettings() {
        const settings = JSON.parse(localStorage.getItem("settings") || "{}");

        // NOTE: default values for testing
        settings.shifts = settings.shifts || [];
        settings.startDate = settings.startDate || "";
        settings.shiftRhythm = settings.shiftRhythm || [];

        return settings;
    }

    function save() {
        console.debug("saving data...");

        localStorage.setItem("settings", JSON.stringify({
            shifts,
            startDate,
            shiftRhythm,
        }))
    }
</script>

{#if dialogAddShift}
    <DialogAddShift
        bind:open={dialogAddShift}
        on:submit={({ detail }) => {
            dialogAddShift = false;

            if (shifts.find(s => s.name === detail.name) || !detail.name) {
                return;
            }

            shifts = [
                ...shifts,
                detail,
            ];
        }}
    />
{/if}

{#if dialogEditShift}
    <DialogEditShift
        bind:open={dialogEditShift}
        shifts={shifts}
        on:submit={({ detail }) => {
            dialogEditShift = false;

            shifts = detail;
        }}
    />
{/if}

<section class="shifts">
    <article>
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
                {#each shifts as item}
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
                        {...(shifts.find(s => s.name === shift) || { name: shift, visible: true })}
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
    </article>
</section>

<style>
</style>
