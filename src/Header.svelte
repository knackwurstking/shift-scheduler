<script>
    import { createEventDispatcher } from "svelte";

    import Pencil from "svelte-material-icons/Pencil.svelte";
    import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";
    import CalendarToday from "svelte-material-icons/CalendarToday.svelte";
    import Wrench from "svelte-material-icons/Wrench.svelte";

    import { Button } from "svelte-css";

    import * as lang from "./lib/js/lang";

    import { DatePickerDialog, DatePicker } from "./lib/components";

    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {boolean} */
    export let enableBackButton = false;
    export let enableDatePicker = false;

    /** @type {Date} */
    export let datePickerDate;
    /** @type {string | undefined | null} */
    export let title = undefined;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /** @type {DatePickerDialog} */
    let datePickerDialog;
</script>

<header class="container">
    <span
        style="display: flex; justify-content: flex-start; align-items: center; width: calc(100% - 15em);"
    >
        <span class="item" class:visible={enableBackButton}>
            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2)"
                on:click={() => dispatch("backbuttonclick")}
            >
                <ArrowLeft />
            </Button.Icon>
        </span>

        <!-- DatePicker -->
        <span
            class="item"
            class:visible={enableDatePicker}
            style="min-width: 7em"
        >
            <DatePicker
                bind:currentDate={datePickerDate}
                on:click={async ({ detail }) => {
                    datePickerDialog.open(detail.year, detail.month);
                }}
            />
        </span>

        <h1
            class="item"
            class:visible={!!title}
            style="margin-left: var(--spacing);"
        >
            {lang.get("appBar", "settings")}
        </h1>
    </span>

    <span
        style={`
            display: flex;
            justify-content: flex-end;
        `}
    >
        <span class="item" class:visible={enableDatePicker}>
            <!-- Toggle EditMode -->
            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2);"
                on:click={() => dispatch("editmodeclick")}
            >
                <Pencil />
            </Button.Icon>
        </span>

        <span class="item" class:visible={enableDatePicker}>
            <!-- GoTo Today -->
            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2);"
                disabled={(() => {
                    const today = new Date();
                    return (
                        today.getFullYear() === datePickerDate.getFullYear() &&
                        today.getMonth() === datePickerDate.getMonth()
                    );
                })()}
                on:click={() => dispatch("currentdatechange", new Date())}
            >
                <CalendarToday />
            </Button.Icon>
        </span>

        <span class="item" class:visible={enableDatePicker}>
            <!-- Settings -->
            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2);"
                on:click={() => dispatch("goto", "settings")}
            >
                <Wrench />
            </Button.Icon>
        </span>
    </span>
</header>

<DatePickerDialog
    bind:this={datePickerDialog}
    on:submit={async ({ detail }) => {
        dispatch("currentdatechange", new Date(detail.year, detail.month));
        datePickerDialog.close();
    }}
/>

<style>
    header {
        position: relative;
        height: 3.5em;

        padding: 0 calc(var(--spacing) / 2);

        display: flex;
        justify-content: space-between;
        align-items: center;

        border-bottom: 0.1em solid hsl(var(--border));
    }

    header .item:not(.visible) {
        display: none;
    }
</style>
