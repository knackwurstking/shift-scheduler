<script>
    import Shift from "./Shift.svelte";
    import ShiftAdd from "./ShiftAdd.svelte";
    import DialogAddShift from "./DialogAddShift.svelte";
    import DialogEditShift from "./DialogEditShift.svelte";
    import DialogEditShiftRhythm from "./DialogEditShiftRhythm.svelte";

    let { shifts, startDate, shiftRhythm } = getSettings();
    $: !!shifts && save();
    $: typeof startDate === "string" && save();
    $: !!shiftRhythm && save();

    let addShiftDialogOpen = false;
    let editShiftRhythmDialogOpen = false;

    let editShiftDialogOpen = false;
    /** @type {string} */
    let editShiftDialogSelected;

    /**
     * @returns {import(".").Settings}
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

        localStorage.setItem(
            "settings",
            JSON.stringify({
                shifts,
                startDate,
                shiftRhythm,
            })
        );
    }
</script>

<section class="shifts">
    {#if addShiftDialogOpen}
        <DialogAddShift
            bind:open={addShiftDialogOpen}
            on:submit={({ detail }) => {
                addShiftDialogOpen = false;

                if (shifts.find((s) => s.name === detail.name) || !detail.name) {
                    return;
                }

                shifts = [...shifts, detail];
            }}
        />
    {/if}

    {#if editShiftDialogOpen}
        <DialogEditShift
            bind:open={editShiftDialogOpen}
            {shifts}
            selected={editShiftDialogSelected}
            on:submit={({ detail }) => {
                editShiftDialogOpen = false;
                shifts = detail;
            }}
        />
    {/if}

    {#if editShiftRhythmDialogOpen}
        <DialogEditShiftRhythm
            bind:open={editShiftRhythmDialogOpen}
            {shifts}
            rhythm={shiftRhythm}
            on:submit={({ detail }) => {
                editShiftRhythmDialogOpen = false;
                shiftRhythm = detail;
            }}
        />
    {/if}

    <article>
        <label for="start-date">
            Start Date
            <input type="date" name="start-date" class="shift-start-date" bind:value={startDate} />
        </label>

        <div class="shifts">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Shifts</label>

            <ul class="shifts-available">
                {#each shifts as item, index}
                    <Shift
                        {...item}
                        on:click={() => {
                            editShiftDialogSelected = index.toString();
                            editShiftDialogOpen = true;
                        }}
                    />
                {/each}

                <ShiftAdd on:click={() => (addShiftDialogOpen = true)} />
            </ul>
        </div>

        <div class="rhythm">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>
                Rhythm
            </label>
            <button
                class="secondary"
                on:click={() => {
                    editShiftRhythmDialogOpen = true;
                }}
            >
                Edit
            </button>
        </div>
    </article>
</section>

<style>
    section {
        width: 100%;
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
    }

    section article {
        padding: var(--spacing);
    }

    section article > * {
        border-bottom: 1px solid var(--muted-border-color);
    }

    section .shifts {
        position: relative;
    }

    section .shifts > label {
        margin-bottom: 16px;
    }

    section .rhythm {
        display: flex;
        justify-content: space-between;
        border-bottom: none;
    }

    section .rhythm button {
        width: fit-content;
    }
</style>