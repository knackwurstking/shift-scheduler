<script>
    import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";

    import { createEventDispatcher } from "svelte";
    import { UI } from "ui";

    const dispatch = createEventDispatcher();

    /** @type {Date} */
    export let currentDate;

    /** @type {import("../lib/components").DatePickerDialog} */
    export let datePickerDialog;

    export let backButton = false;
    export let datePicker = false;

    function openDatePickerDialog() {
        datePickerDialog.open(
            currentDate.getFullYear(),
            currentDate.getMonth(),
        );
    }
</script>

{#if backButton}
    <UI.Button.Icon ghost on:click={() => dispatch("backbuttonclick")}>
        <ArrowLeft />
    </UI.Button.Icon>
{/if}

{#if datePicker}
    <UI.FlexGrid.Col style="width: 7.5em; height: 100%;">
        <UI.Button.Root
            class="is-max"
            variant="outline"
            on:click={() => openDatePickerDialog()}
        >
            {currentDate.getFullYear()} / {(currentDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}
        </UI.Button.Root>
    </UI.FlexGrid.Col>
{/if}
