<script>
    import { createEventDispatcher } from "svelte";

    import * as db from "../../js/db";
    import { ripple } from "../../js/ripple";
    import * as utils from "../../js/utils";

    const dispatch = createEventDispatcher();

    let _primaryRipple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });

    /** @type {HTMLDialogElement} */
    let dialog;

    /** @type {number} */
    let year;
    /** @type {number} */
    let month;
    /** @type {number} */
    let date;

    /** @type {import("../settings").Shift | null} */
    let defaultShift;
    /** @type {import("../settings").Shift | null} */
    let shift;
    /** @type {string} */
    let note;

    /** @type {string} */
    let current = "-1";

    /** @type {import("../settings").Settings} */
    let settings = JSON.parse(
        localStorage.getItem("settings") || '{ "shifts": [], "startDate": "", "shiftRhythm": []}'
    );

    /**
     * @param {number} _year
     * @param {number} _month
     * @param {number} _date
     */
    export async function open(_year, _month, _date) {
        year = _year;
        month = _month;
        date = _date;

        const data = (await db.get(year, month))[`${year}-${month}-${date}`];

        defaultShift = utils.calcShiftStep(new Date(year, month, date));

        shift = data?.shift || null;
        if (shift) current = settings.shifts.findIndex((s) => s.name === shift?.name).toString();
        else current = "-1";

        note = data?.note || "";

        dialog.show();
    }

    export async function close() {
        dialog.close();
    }
</script>

<!-- TODO: use header/footer tag and contrast cancel button -->
<dialog bind:this={dialog}>
    <article>
        {#if !!date}
            <h2 class="title">
                {year} / {(month + 1).toString().padStart(2, "0")}
                / {date.toString().padStart(2, "0")}
            </h2>
        {/if}

        <select bind:value={current}>
            <option value="-1" selected={current === "-1"}
                >(Default) {defaultShift?.name || ""}</option
            >

            {#each settings.shifts as shift, index}
                <option value={index.toString()} selected={current === index.toString()}
                    >{shift.name}</option
                >
            {/each}
        </select>

        <label for="note">
            Note
            <textarea name="note" cols="30" rows="10" bind:value={note} />
        </label>

        <button
            use:_primaryRipple
            on:click={() =>
                dispatch("submit", {
                    date: { year, month, date },
                    shift: settings.shifts.find((_s, i) => i.toString() === current) || null,
                    note: note,
                })}
        >
            OK
        </button>
    </article>
</dialog>

<style>
    label textarea[name="note"] {
        resize: none;
    }
</style>
