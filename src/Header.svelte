<script>
    import { createEventDispatcher } from "svelte";

    import Pencil from "svelte-material-icons/Pencil.svelte";
    import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";
    import CalendarToday from "svelte-material-icons/CalendarToday.svelte";
    import Wrench from "svelte-material-icons/Wrench.svelte";

    import { Button, TopAppBar, Grid } from "svelte-css";

    import { DatePickerDialog } from "./lib/components";

    /******************************
     * Variable Export Definitions
     ******************************/

    // TODO: using $view to handle top-app-bar content

    /** @type {boolean} */
    export let enableBackButton = false;
    export let enableDatePicker = false;

    // TODO: rename to `currentDate`

    /** @type {Date} */
    export let datePickerDate;

    /** @type {string | undefined} */
    export let title = undefined;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /** @type {DatePickerDialog} */
    let datePickerDialog;
</script>

<TopAppBar.Root uiContainer>
    <svelte:fragment slot="left">
        {#if enableBackButton}
            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2)"
                ghost
                on:click={() => dispatch("backbuttonclick")}
            >
                <ArrowLeft />
            </Button.Icon>
        {/if}

        {#if enableDatePicker}
            <Grid.Col height="100%" width="7.5em">
                <Button.Root
                    class="is-max"
                    variant="outline"
                    on:click={() => {
                        datePickerDialog.open(
                            datePickerDate.getFullYear(),
                            datePickerDate.getMonth(),
                        );
                    }}
                >
                    {datePickerDate.getFullYear()} / {(datePickerDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}
                </Button.Root>
            </Grid.Col>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="center">
        {#if !!title}
            <h4 class="title">{title}</h4>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="right">
        <!-- TODO: new page: jspdf year table view and download/share button -->
        {#if enableDatePicker}
            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2);"
                ghost
                on:click={() => dispatch("editmodeclick")}
            >
                <Pencil />
            </Button.Icon>

            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2);"
                ghost
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

            <Button.Icon
                style="margin: 0 calc(var(--spacing) / 2);"
                ghost
                on:click={() => dispatch("goto", "settings")}
            >
                <Wrench />
            </Button.Icon>
        {/if}
    </svelte:fragment>
</TopAppBar.Root>

<DatePickerDialog
    bind:this={datePickerDialog}
    on:submit={async ({ detail }) => {
        dispatch("currentdatechange", new Date(detail.year, detail.month));
        datePickerDialog.close();
    }}
/>
