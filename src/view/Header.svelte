<script>
    import FilePdfBox from "svelte-material-icons/FilePdfBox.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte";
    import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";
    import CalendarToday from "svelte-material-icons/CalendarToday.svelte";
    import Wrench from "svelte-material-icons/Wrench.svelte";

    import { createEventDispatcher } from "svelte";
    import { UI } from "ui";

    import { DatePickerDialog } from "../lib/components";

    import * as Store from "../lib/stores";

    const dispatch = createEventDispatcher();
    const view = Store.view.create();

    /** @type {Date} */
    export let currentDate;
    /** @type {string | undefined} */
    export let title = undefined;

    /** @type {DatePickerDialog} */
    let datePickerDialog;
    let enableBackButton = false;
    let enableDatePicker = false;

    $: !!view && initViewStore();

    function initViewStore() {
        view.subscribe((currentView) => {
            enableBackButton = view.history().length > 1;
            enableDatePicker = currentView === "calendar";
        });
    }
</script>

<UI.TopAppBar.Root uiContainer>
    <svelte:fragment slot="left">
        {#if enableBackButton}
            <UI.Button.Icon ghost on:click={() => dispatch("backbuttonclick")}>
                <ArrowLeft />
            </UI.Button.Icon>
        {/if}

        {#if enableDatePicker}
            <UI.FlexGrid.Col style="width: 7.5em; height: 100%;">
                <UI.Button.Root
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
                </UI.Button.Root>
            </UI.FlexGrid.Col>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="center">
        {#if !!title}
            <h4 class="title" style:white-space="nowrap">{title}</h4>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="right">
        {#if enableDatePicker}
            <UI.Button.Icon ghost on:click={() => dispatch("goto", "pdf")}>
                <FilePdfBox />
            </UI.Button.Icon>

            <UI.Button.Icon ghost on:click={() => dispatch("editmodeclick")}>
                <Pencil />
            </UI.Button.Icon>

            <UI.Button.Icon
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
            </UI.Button.Icon>

            <UI.Button.Icon ghost on:click={() => dispatch("goto", "settings")}>
                <Wrench />
            </UI.Button.Icon>
        {/if}
    </svelte:fragment>
</UI.TopAppBar.Root>

<DatePickerDialog
    bind:this={datePickerDialog}
    on:submit={async ({ detail }) => {
        dispatch("currentdatechange", new Date(detail.year, detail.month));
        datePickerDialog.close();
    }}
/>
