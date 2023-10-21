<script>
    import { createEventDispatcher } from "svelte";

    import {
        Button,
        Dialog,
        DialogHeader,
        DialogFooter,
        Label,
    } from "svelte-css";

    import * as db from "../../js/db";
    import * as lang from "../../js/lang";

    import { createShiftSetupStore } from "../../stores/shift-setup-store";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog} */
    let dialog;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /** @type {number} */
    let year;
    /** @type {number} */
    let month;
    /** @type {number} */
    let date;

    /** @type {import("../../stores/shift-setup-store").Shift | null} */
    let defaultShift;
    /** @type {import("../../stores/shift-setup-store").Shift | null} */
    let shift;
    /** @type {string} */
    let note;

    /** @type {string} */
    let current = "-1";

    /*********************
     * Store: shift-setup
     *********************/

    let shiftSetup = createShiftSetupStore();

    /******************************
     * Function Export Definitions
     ******************************/

    /**
     * @param {number} _year
     * @param {number} _month
     * @param {number} _date
     */
    export async function open(_year, _month, _date) {
        year = _year;
        month = _month;
        date = _date;

        defaultShift = shiftSetup.calcShiftStep(new Date(year, month, date));

        const data = (await db.get(year, month))[`${year}-${month}-${date}`];
        shift = data?.shift || null;
        if (shift) current = shiftSetup.getShiftIndex(shift.id).toString();
        else current = "-1";

        note = data?.note || "";

        dialog.showModal();
    }

    export async function close() {
        dialog.close();
    }
</script>

<Dialog
    bind:this={dialog}
    style={`
        width: 17rem;
        max-width: 100%;
    `}
>
    <DialogHeader
        slot="header"
        title={`${year} / ${(month + 1).toString().padStart(2, "0")} / ${
            date?.toString().padStart(2, "0") || "??"
        }`}
        on:close={() => dispatch("close")}
    />

    <section>
        <Label>
            <select bind:value={current} class="col" style="width: 100%;">
                <option value="-1" selected={current === "-1"}>
                    (Default) {defaultShift?.name || ""}
                </option>

                {#each $shiftSetup.shifts as shift, index}
                    <option
                        value={index.toString()}
                        selected={current === index.toString()}
                    >
                        {shift.name}
                    </option>
                {/each}
            </select>
        </Label>
    </section>

    <section>
        <Label secondaryText={lang.get("dayDialog", "textfieldLabel")}>
            <textarea bind:value={note} rows="10" style="width: 100%;" />
        </Label>
    </section>

    <DialogFooter>
        <Button
            color="primary"
            on:click={() =>
                dispatch("submit", {
                    date: { year, month, date },
                    shift: shiftSetup.getShift(parseInt(current, 10)) || null,
                    note: note,
                })}
        >
            {lang.get("buttons", "submit")}
        </Button>
    </DialogFooter>
</Dialog>

<style>
    textarea {
        resize: none;
    }
</style>
