<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import * as db from "../../js/db";
    import * as utils from "../../js/utils";
    import { ripple } from "../../js/ripple";
    let _primaryRipple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });

    /** @type {HTMLDialogElement} */
    let dialog;

    /** @type {Date} */
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
     *
     * @param {Date} _date
     */
    export async function open(_date) {
        date = _date;

        const data = (await db.get(date.getFullYear(), date.getMonth()))[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`];
        defaultShift = utils.calcShiftStep(date);
        shift = data?.shift || null;
        if (shift) current = settings.shifts.findIndex((s) => s.name === shift?.name).toString();
        note = data?.note || "";

        dialog.show();
    }

    export async function close() {
        dialog.close();
    }
</script>

<dialog bind:this={dialog}>
    <article>
        {#if !!date}
            <h2 class="title">
                {date.getFullYear()} / {(date.getMonth() + 1).toString().padStart(2, "0")}
                / {date.getDate().toString().padStart(2, "0")}
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
                    date: date,
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
