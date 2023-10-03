<script>
    import { createEventDispatcher } from "svelte";

    // @ts-ignore
    import MdModeEdit from "svelte-icons/md/MdModeEdit.svelte";
    // @ts-ignore
    import MdToday from "svelte-icons/md/MdToday.svelte";
    // @ts-ignore
    import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";
    // @ts-ignore
    import TiSpanner from "svelte-icons/ti/TiSpanner.svelte";

    import DatePicker from "./lib/components/date-picker";
    import IconButton from "./lib/components/icon-button";
    import { DatePickerDialog } from "./lib/components/dialogs";

    /** @type {boolean} */
    export let enableBackButton = false;
    export let enableDatePicker = false;

    /** @type {Date} */
    export let datePickerDate;
    /** @type {string | undefined | null} */
    export let title = undefined;

    const dispatch = createEventDispatcher();

    /** @type {DatePickerDialog} */
    let datePickerDialog;
</script>

<header style="font-size: 1rem; padding: 4px;">
    <span class="enable-back-button" class:visible={enableBackButton}>
        <IconButton on:click={() => dispatch("backbuttonclick")}>
            <TiArrowBackOutline />
        </IconButton>
    </span>

    <!--DatePicker style="margin: 0; width: 30rem;" bind:monthCount={currentMonthCount} /-->
    <span class="enable-date-picker" class:visible={enableDatePicker}>
        <DatePicker
            style="margin: 0; width: 30rem;"
            bind:currentDate={datePickerDate}
            on:click={async ({ detail }) => {
                datePickerDialog.open(detail.year, detail.month);
            }}
        />
    </span>

    <h1 style="margin: 0; margin-left: 8px;" class:visible={!!title}>Settings</h1>

    <span class="spacer" />

    <div class="actions">
        <span class="enable-data-picker" class:visible={enableDatePicker}>
            <!-- Toggle EditMode -->
            <IconButton
                margin="8px 4px"
                on:click={() => dispatch("editmodeclick")}
            >
                <MdModeEdit />
            </IconButton>

            <!-- TODO: GoTo Today -->
            <IconButton
                margin="8px 4px"
                disabled={today.getFullYear() === currentDate.getFullYear() &&
                    today.getMonth() === currentDate.getMonth()}
                on:click={() => setCurrentDate(new Date())}
            >
                <MdToday />
            </IconButton>

            <!-- Settings -->
            <IconButton margin="8px 4px" on:click={() => goTo("settings")}>
                <TiSpanner />
            </IconButton>
        </span>
    </div>
</header>

<DatePickerDialog
    bind:this={datePickerDialog}
    on:cancel={async () => {
        datePickerDialog.close();
    }}
    on:submit={async ({ detail }) => {
        dispatch("currentdatachange", new Date(detail.year, detail.month));
        datePickerDialog.close();
    }}
/>

<style>
    .enable-back-button:not(.visible),
    .enable-date-picker:not(.visible) {
        display: none;
    }
</style>