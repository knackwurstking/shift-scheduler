<script>
    import { createEventDispatcher } from "svelte";

    import FilePdfBox from "svelte-material-icons/FilePdfBox.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte";
    import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";
    import CalendarToday from "svelte-material-icons/CalendarToday.svelte";
    import Wrench from "svelte-material-icons/Wrench.svelte";

    import { Button, TopAppBar, FlexGrid } from "svelte-css";

    import { DatePickerDialog } from "../lib/components";

    import * as Store from "../lib/stores";

    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {Date} */
    export let currentDate;

    /** @type {string | undefined} */
    export let title = undefined;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /** @type {DatePickerDialog} */
    let datePickerDialog;

    let enableBackButton = false;
    let enableDatePicker = false;

    /**************
     * Store: view
     **************/

    const view = Store.view.create();
    $: !!view && view.subscribe(currentView => {
        enableBackButton = view.history().length > 1;
        enableDatePicker = currentView === "calendar";
    })
</script>

<TopAppBar.Root uiContainer>
    <svelte:fragment slot="left">
        {#if enableBackButton}
            <Button.Icon
                ghost
                on:click={() => dispatch("backbuttonclick")}
            >
                <ArrowLeft />
            </Button.Icon>
        {/if}

        {#if enableDatePicker}
            <FlexGrid.Col style="width: 7.5em; height: 100%;">
                <Button.Root
                    class="is-max"
                    variant="outline"
                    on:click={() => {
                        datePickerDialog.open(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                        );
                    }}
                >
                    {currentDate.getFullYear()} / {(currentDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}
                </Button.Root>
            </FlexGrid.Col>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="center">
        {#if !!title}
            <h4 class="title" style:white-space="nowrap">{title}</h4>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="right">
        {#if enableDatePicker}
            <Button.Icon
                ghost
                on:click={() => dispatch("goto", "pdf")}
            >
                <FilePdfBox />
            </Button.Icon>

            <Button.Icon
                ghost
                on:click={() => dispatch("editmodeclick")}
            >
                <Pencil />
            </Button.Icon>

            <Button.Icon
                ghost
                disabled={(() => {
                    const today = new Date();
                    return (
                        today.getFullYear() === currentDate.getFullYear() &&
                        today.getMonth() === currentDate.getMonth()
                    );
                })()}
                on:click={() => dispatch("currentdatechange", new Date())}
            >
                <CalendarToday />
            </Button.Icon>

            <Button.Icon
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
