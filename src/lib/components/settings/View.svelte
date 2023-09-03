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

    let dialogAddShift = false;
    let dialogEditShiftRhythm = false;

    let editShiftDialogOpen = false;
    /** @type {string} */
    let editShiftDialogSelected;

    /**
     * @returns {Settings}
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
    {#if dialogAddShift}
        <DialogAddShift
            bind:open={dialogAddShift}
            on:submit={({ detail }) => {
                dialogAddShift = false;

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

    {#if dialogEditShiftRhythm}
        <DialogEditShiftRhythm
            bind:open={dialogEditShiftRhythm}
            {shifts}
            rhythm={shiftRhythm}
            on:submit={({ detail }) => {
                dialogEditShiftRhythm = false;
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

                <ShiftAdd on:click={() => (dialogAddShift = true)} />
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
                    dialogEditShiftRhythm = true;
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

    section .shifts {
        position: relative;
    }

    section .shifts > label {
        margin-bottom: 16px;
    }

    section .rhythm {
        display: flex;
        justify-content: space-between;
    }

    section .rhythm button {
        width: fit-content;
    }
</style>