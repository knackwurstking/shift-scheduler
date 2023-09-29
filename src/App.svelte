<script>
    import "./app.css";

    import { onMount } from "svelte";
    import { App } from "@capacitor/app";

    import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";
    import TiSpanner from "svelte-icons/ti/TiSpanner.svelte";
    import MdModeEdit from "svelte-icons/md/MdModeEdit.svelte";
    import MdToday from "svelte-icons/md/MdToday.svelte";

    //import * as ripple from "./lib/js/ripple";
    import * as utils from "./lib/js/utils";
    import * as db from "./lib/js/db";
    import * as settings from "./lib/js/settings";

    import { EditDayDialog, DatePickerDialog } from "./lib/components/dialogs";
    import DatePicker from "./lib/components/date-picker";
    import IconButton from "./lib/components/icon-button";
    import Calendar from "./lib/components/calendar";
    import SettingsView from "./lib/components/settings";
    import ShiftCard from "./lib/components/shift";

    /** @type {DatePickerDialog} */
    let datePickerDialog;

    /** @type {EditDayDialog} */
    let editDayDialog;

    /** @type {Calendar} */
    let calendar;

    /** @type {Themes} */
    let currentTheme = "custom";

    /** @type {Views} */
    let view = "calendar";
    /** @type {Views[]}*/
    let viewStack = [view];

    /** @type {Date} */
    let currentDate = new Date();

    /** @type {boolean} */
    let editMode_open = false;
    /** @type {number} - -2 will remove the custom shift from the database */
    let editMode_index = -1;

    /** @type {Date} */
    let today = new Date();

    $: calendar && initCalendar();

    async function initCalendar() {
        calendar.set(currentDate);
    }

    /**
     *
     * @param {Date | null} date
     */
    async function setCurrentDate(date) {
        if (date) currentDate = date;
        calendar.set(currentDate);
    }

    /**
     *
     * @param {Views} v
     */
    async function goTo(v) {
        editMode_open = false;
        viewStack = [...viewStack, v];
        view = v;

        if (view === "calendar") {
            loadTheme();
        }
    }

    async function goBackInHistory() {
        if (viewStack.length === 1) return;
        viewStack.pop();
        viewStack = viewStack;
        view = viewStack[viewStack.length - 1];
    }
    
    /**
     * @returns {Promise<import("./lib/js/settings").Shift | "reset">}
     */
    async function getEditModeShift() {
        if (editMode_index === -2) return "reset";
        return settings.data.shifts[editMode_index] || null;
    }

    async function loadTheme() {
        settings.load().then(() => {
            currentTheme = settings.data.currentTheme;
            if (settings.data.mode !== "auto") {
                document.documentElement.setAttribute("data-theme", settings.data.mode);
            } else {
                document.documentElement.removeAttribute("data-theme");
            }
        });
    }

    // TODO: need to update today after 12:00 AM

    onMount(async () => {
        if (utils.isAndroid()) {
            App.addListener("backButton", () => goBackInHistory());
        }

        loadTheme();
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="/css/themes/{currentTheme}.min.css" />
</svelte:head>

<header class="container-fluid" style="font-size: 1rem;">
    <!-- Top app bar -->

    {#if view !== viewStack[0]}
        <div class="actions">
            <IconButton on:click={() => goBackInHistory()}>
                <TiArrowBackOutline />
            </IconButton>
        </div>
    {/if}

    {#if view === "calendar"}
        <!--DatePicker style="margin: 0; width: 30rem;" bind:monthCount={currentMonthCount} /-->
        <DatePicker
            style="margin: 0; width: 30rem;"
            bind:currentDate
            on:click={async ({ detail }) => {
                datePickerDialog.open(detail.year, detail.month);
            }}
        />
    {:else if view === "settings"}
        <h1 style="margin: 0; margin-left: 8px;">Settings</h1>
    {/if}

    <span class="spacer" />

    <div class="actions">
        {#if view === "calendar"}
            <!-- Edit Shifts -->
            <IconButton
                margin="8px 4px"
                on:click={() => {
                    editMode_open = !editMode_open;
                }}><MdModeEdit /></IconButton
            >

            <!-- GoTo Today -->
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
        {/if}
    </div>
</header>

<main class="container-fluid" style={`bottom: ${editMode_open ? "calc(3em + 22px)" : "1px"}`}>
    {#if view === "calendar"}
        <Calendar
            bind:this={calendar}
            on:click={async ({ detail }) => {
                if (detail && editMode_open) {
                    let shift = await getEditModeShift();
                    if (!shift) {
                        return;
                    }

                    const { note } = await db.getDataForDay(detail);

                    if (shift === "reset") {
                        shift = null;
                        if (note) {
                            await db.setDataForDay(detail, null, note);
                        } else {
                            await db.removeDataForDay(detail);
                        }
                    } else {
                        await db.setDataForDay(detail, shift, note);
                    }

                    calendar.reload();
                } else if (detail) {
                    editDayDialog.open(detail);
                }
            }}
            on:currentdatechange={({ detail }) => (currentDate = detail)}
        />
    {:else if view === "settings"}
        <SettingsView />
    {/if}
</main>

<footer class="container-fluid" class:visible={editMode_open}>
    {#if editMode_open && !!settings}
        <span>
            <ShiftCard
                name="Reset"
                visible={false}
                active={editMode_index === -2}
                color="var(--color)"
                id={-2}
                on:click={() => {
                    editMode_index = editMode_index === -2 ? -1 : -2;
                }}
            />
        </span>

        {#key settings.data}
            {#each settings.data.shifts as shift, index}
                <span>
                    <ShiftCard
                        {...shift}
                        active={editMode_index == index}
                        on:click={() => {
                            editMode_index = editMode_index === index ? -1 : index;
                        }}
                    />
                </span>
            {/each}
        {/key}
    {/if}
</footer>

<DatePickerDialog
    bind:this={datePickerDialog}
    on:cancel={async () => {
        datePickerDialog.close();
    }}
    on:submit={async ({ detail }) => {
        setCurrentDate(new Date(detail.year, detail.month));
        datePickerDialog.close();
    }}
/>

<EditDayDialog
    bind:this={editDayDialog}
    on:submit={async ({ detail }) => {
        if (!detail.shift && !detail.note) {
            await db.removeDataForDay(detail.date);
        } else {
            await db.setDataForDay(detail.date, detail.shift, detail.note);
        }

        editDayDialog.close();
        calendar.reload();
    }}
/>

<style>
    :global(html, body) {
        overflow: hidden;
    }

    :global(button) {
        position: relative;
        overflow: hidden;
    }

    :global(*) {
        box-sizing: border-box;
    }

    header {
        position: relative;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid var(--muted-border-color);
    }

    header > .spacer {
        width: 100%;
        border: none;
    }

    header > .actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }

    main {
        position: fixed;
        top: 60px;
        right: 0;
        left: 0;
        padding: 0;
    }

    footer {
        transform: none;
        height: calc(3em + 22px);
        right: 0;
        bottom: 0;
        left: 0;
        position: absolute;
        border-top: 1px solid var(--muted-border-color);
        display: flex;
        overflow: hidden;
        overflow-x: auto;
        background-color: var(--background-color);
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    footer::-webkit-scrollbar {
        display: none;
    }

    footer:not(.visible) {
        transform: translateY(100%);
    }
</style>
