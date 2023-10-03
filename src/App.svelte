<script>
    import "./app.css";

    import { App } from "@capacitor/app";
    import { onMount } from "svelte";

    import * as db from "./lib/js/db";
    import * as settings from "./lib/js/settings";
    import * as utils from "./lib/js/utils";

    import Header from "./Header.svelte";

    import CalendarView from "./lib/view/calendar"
    import SettingsView from "./lib/view/settings";

    import { EditDayDialog } from "./lib/components/dialogs";
    import ShiftCard from "./lib/components/shift";

    /** @type {Header} */
    let header;

    /** @type {EditDayDialog} */
    let editDayDialog;

    /** @type {CalendarView} */
    let calendarView;
    $: calendarView && _initCalendar();

    function _initCalendar() {
        calendarView.set(currentDate);
    }

    /** @type {Date} */
    let currentDate = new Date();

    /**
     * @param {Date | null} date
     */
    async function setCurrentDate(date) {
        if (date) currentDate = date;
        calendarView.set(currentDate);
    }

    /** @type {Views} */
    let view = "calendar";
    /** @type {Views[]}*/
    let viewStack = [view];

    /**
     *
     * @param {Views} v
     */
    async function goTo(v) {
        editMode = false;
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

    /** @type {boolean} */
    let editMode = false;
    /** @type {number} - -2 will remove the custom shift from the database */
    let editModeIndex = -1;
    
    /**
     * @returns {Promise<import("./lib/js/settings").Shift | "reset">}
     */
    async function getEditModeShift() {
        if (editModeIndex === -2) return "reset";
        return settings.data.shifts[editModeIndex] || null;
    }

    /** @type {Themes} */
    let currentTheme = "custom";

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

    /** @type {Date} */
    let today = new Date();

    async function updateToday() {
        const today = new Date();
        const next = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0, 0, 0);
        const timeout = next.getTime() - today.getTime();
        console.debug(`updateToday: timeout set to ${timeout}`, );

        setTimeout(() => {
            console.debug("update today: reload calendar");
            calendarView.reload();
            updateToday();
        }, timeout);
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

<Header
    bind:this={header}

    enableBackButton={viewStack.length > 1}
    enableDatePicker={view === "calendar"}

    datePickerDate={currentDate}
    title={(view === "settings") ? "Settings" : undefined}

    on:backbuttonclick={() => goBackInHistory()}
    on:editmodeclick={() => (editMode = !editMode)}
/>

<main style={`bottom: ${editMode ? "calc(3em + 22px)" : "1px"}`}>
    {#if view === "calendar"}
        <CalendarView
            bind:this={calendarView}
            on:click={async ({ detail }) => {
                if (detail && editMode) {
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

                    calendarView.reload();
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

<footer class:visible={editMode}>
    {#if editMode && !!settings.data}
        <span>
            <ShiftCard
                name="Reset"
                visible={false}
                active={editModeIndex === -2}
                color="var(--color)"
                id={-2}
                on:click={() => {
                    editModeIndex = editModeIndex === -2 ? -1 : -2;
                }}
            />
        </span>

        {#key settings.data}
            {#each settings.data.shifts as shift, index}
                <span>
                    <ShiftCard
                        {...shift}
                        active={editModeIndex == index}
                        on:click={() => {
                            editModeIndex = editModeIndex === index ? -1 : index;
                        }}
                    />
                </span>
            {/each}
        {/key}
    {/if}
</footer>

<EditDayDialog
    bind:this={editDayDialog}
    on:cancel={async () => {
        editDayDialog.close();
    }}
    on:submit={async ({ detail }) => {
        const key = `${detail.date.year}-${detail.date.month}-${detail.date.date}`;

        if (!detail.shift && !detail.note) {
            await db.removeData(detail.date.year, detail.date.month, key);
        } else {
            await db.setData(detail.date.year, detail.date.month, key, detail.shift, detail.note);
        }

        editDayDialog.close();
        calendarView.reload();
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
