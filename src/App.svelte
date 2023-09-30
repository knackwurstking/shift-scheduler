<script>
    import "./app.css";

    import { App } from "@capacitor/app";
    import { onMount } from "svelte";

    // @ts-ignore
    import MdModeEdit from "svelte-icons/md/MdModeEdit.svelte";
    // @ts-ignore
    import MdToday from "svelte-icons/md/MdToday.svelte";
    // @ts-ignore
    import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";
    // @ts-ignore
    import TiSpanner from "svelte-icons/ti/TiSpanner.svelte";

    import * as db from "./lib/js/db";
    import * as settings from "./lib/js/settings";
    import * as utils from "./lib/js/utils";

    import Calendar from "./lib/components/calendar";
    import DatePicker from "./lib/components/date-picker";
    import { DatePickerDialog, EditDayDialog } from "./lib/components/dialogs";
    import IconButton from "./lib/components/icon-button";
    import SettingsView from "./lib/components/settings";
    import ShiftCard from "./lib/components/shift";

    /** @type {DatePickerDialog} */
    let datePickerDialog;
    /** @type {EditDayDialog} */
    let editDayDialog;


    /** @type {Calendar} */
    let calendar;
    $: calendar && _initCalendar();

    function _initCalendar() {
        calendar.set(currentDate);
    }


    /** @type {Themes} */
    let currentTheme = "custom";


    /** @type {Date} */
    let currentDate = new Date();

    /**
     * @param {Date | null} date
     */
    async function setCurrentDate(date) {
        if (date) currentDate = date;
        calendar.set(currentDate);
    }


    /** @type {boolean} */
    let editMode_open = false;
    /** @type {number} - -2 will remove the custom shift from the database */
    let editMode_index = -1;

    /** @type {Date} */
    let today = new Date();


    /** @type {Views} */
    let view = "calendar";
    /** @type {Views[]}*/
    let viewStack = [view];

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

    async function updateToday() {
        const today = new Date();
        setTimeout(() => {
            console.debug("update today: reload calendar");
            calendar.reload();
            updateToday();
        }, (new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0, 0, 0)).getMilliseconds() - (new Date()).getMilliseconds());
    }

    onMount(async () => {
        if (utils.isAndroid()) {
            App.addListener("backButton", () => goBackInHistory());
        }

        loadTheme();
        updateToday();
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="/css/themes/{currentTheme}.min.css" />
</svelte:head>

<header style="font-size: 1rem; padding: 4px;">
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

<main style={`bottom: ${editMode_open ? "calc(3em + 22px)" : "1px"}`}>
    {#if view === "calendar"}
        <Calendar
            bind:this={calendar}
            on:click={async ({ detail }) => {
                if (detail && editMode_open) {
                    let shift = await getEditModeShift();
                    if (!shift) {
                        return;
                    }

                    const key = `${detail.getFullYear()}-${detail.getMonth()}-${detail.getDate()}`;
                    const { note } = await db.getData(detail.getFullYear(), detail.getMonth(), key);

                    if (shift === "reset") {
                        shift = null;
                        if (note) {
                            await db.setData(detail.getFullYear(), detail.getMonth(), key, null, note);
                        } else {
                            await db.removeData(detail.getFullYear(), detail.getMonth(), key);
                        }
                    } else {
                        await db.setData(detail.getFullYear(), detail.getMonth(), key, shift, note);
                    }

                    calendar.reload();
                } else if (detail) {
                    editDayDialog.open(detail.getFullYear(), detail.getMonth(), detail.getDate());
                }
            }}
            on:currentdatechange={({ detail }) => (currentDate = detail)}
        />
    {:else if view === "settings"}
        <SettingsView />
    {/if}
</main>

<footer class:visible={editMode_open}>
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
        const key = `${detail.date.year}-${detail.date.month}-${detail.date.date}`;

        if (!detail.shift && !detail.note) {
            await db.removeData(detail.date.year, detail.date.month, key);
        } else {
            await db.setData(detail.date.year, detail.date.month, key, detail.shift, detail.note);
        }

        editDayDialog.close();
        calendar.reload();
    }}
/>

<style>
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
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: calc(3em + 22px);
        padding: 0 4px;
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
