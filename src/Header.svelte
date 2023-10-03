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

<style>
    header {
        position: relative;
        height: 60px;

        display: flex;
        align-items: center;

        border-bottom: 1px solid var(--muted-border-color);
    }

    header .spacer {
        width: 100%;

        border: none;
    }

    header .actions {
        height: 100%;

        display: flex;
        align-items: center;

        border: 1px slid red;
    }

    header .item:not(.visible) {
        display: none;
    }
</style>

<header style="font-size: 1rem; padding: 4px;">
    <span class="item" class:visible={enableBackButton}>
        <IconButton on:click={() => dispatch("backbuttonclick")}>
            <TiArrowBackOutline />
        </IconButton>
    </span>

    <!--DatePicker style="margin: 0; width: 30rem;" bind:monthCount={currentMonthCount} /-->
    <span
        class="item"
        class:visible={enableDatePicker}
        style="width: 30rem;"
    >
        <DatePicker
            style="margin: 0;"
            bind:currentDate={datePickerDate}
            on:click={async ({ detail }) => {
                datePickerDialog.open(detail.year, detail.month);
            }}
        />
    </span>

    <h1
        class="item"
        class:visible={!!title}
        style="margin: 0; margin-left: 8px;"
    >
        Settings
    </h1>

    <span class="spacer" />

    <div class="actions">
        <span class="item" class:visible={enableDatePicker}>
            <!-- Toggle EditMode -->
            <IconButton
                margin="8px 4px"
                on:click={() => dispatch("editmodeclick")}
            >
                <MdModeEdit />
            </IconButton>
        </span>

        <span class="item" class:visible={enableDatePicker}>
            <!-- GoTo Today -->
            <IconButton
                margin="8px 4px"
                disabled={(() => {
                    const today = new Date();
                    return (
                        today.getFullYear() === datePickerDate.getFullYear() &&
                        today.getMonth() === datePickerDate.getMonth()
                    )
                })()}
                on:click={() => dispatch("currentdatechange")}
            >
                <MdToday />
            </IconButton>
        </span>

        <span class="item" class:visible={enableDatePicker}>
            <!-- Settings -->
            <IconButton
                margin="8px 4px"
                on:click={() => dispatch("goto", "settings")}
            >
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
