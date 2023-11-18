<script>
    import { createEventDispatcher } from "svelte";

    import {
        Button,
        Dialog,
        Text,
        Input,
    } from "svelte-css";

    import { createViewStore } from "../../stores/view-store.js";
    import { createShiftSetupStore } from "../../stores/shift-setup-store";

    import * as db from "../../js/db";
    import * as lang from "../../js/lang";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog.Root} */
    let dialog;

    /** @type {Input.Select} */
    let select;

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

    /** @type {{ value: string, label: string }[]} */
    let selectItems = [];
    /** @type {{ value: string, label: string }} */
    let selected = undefined;

    /**************
     * Store: view
     **************/

    const view = createViewStore();

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
        note = data?.note || "";

        selectItems = [
            { value: "-1", label: `(Default) ${defaultShift?.name || ""}`},
            ...$shiftSetup.shifts.map(
                (s, i) => ({ value: i.toString(), label: s.name })
            ),
        ];
        selected = !!shift
            ? {
                value: shiftSetup.getShiftIndex(shift.id).toString(),
                label: shift.name,
            }
            : selectItems[0];

        dialog.showModal();
        view.lock();
    }

    export async function close() {
        select.collapse();
        dialog.close();
        view.unlock();
    }
</script>

<Dialog.Root
    bind:this={dialog}
    style={
        "width: 17rem;" +
        "max-width: 100%;"
    }
>
    <Dialog.Header
        title={`${year} / ${(month + 1).toString().padStart(2, "0")} / ${
            date?.toString().padStart(2, "0") || "??"
        }`}
        on:close={() => close()}
    />

    <section class="has-padding-x">
        <Input.Select
            bind:this={select}
            items={selectItems}
            bind:selected
        />
    </section>

    <section>
        <Text.Label secondary={lang.get("dayDialog", "textfieldLabel")}>
            <textarea bind:value={note} rows="10" style="width: 100%;" />
        </Text.Label>
    </section>

    <Dialog.Footer>
        <Button.Root
            color="primary"
            on:click={() =>
                dispatch("submit", {
                    date: { year, month, date },
                    shift: shiftSetup.getShift(parseInt(selected.value, 10)) || null,
                    note: note,
                })}
        >
            {lang.get("buttons", "submit")}
        </Button.Root>
    </Dialog.Footer>
</Dialog.Root>

<style>
    textarea {
        resize: none;
    }
</style>
