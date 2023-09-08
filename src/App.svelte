<script>
    import { onMount } from "svelte";
    import { App } from "@capacitor/app";

    // @ts-ignore
    import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";
    // @ts-ignore
    import TiSpanner from "svelte-icons/ti/TiSpanner.svelte";
    // @ts-ignore
    import MdToday from "svelte-icons/md/MdToday.svelte";
    // @ts-ignore
    import MdModeEdit from "svelte-icons/md/MdModeEdit.svelte";

    //import * as ripple from "./lib/js/ripple";
    import * as utils from "./lib/js/utils";

    import DatePicker from "./lib/components/date-picker";
    import IconButton from "./lib/components/icon-button";
    import InfiniteScrollView from "./lib/components/infinite-scroll-view";
    import { Content as ViewCalendarContent } from "./lib/components/calendar";
    import SettingsView, { Shift } from "./lib/components/settings";

    /** @type {Themes} */
    let currentTheme = "custom"; // TODO: Add a theme picker to the settings page

    /** @type {Views} */
    let view = "calendar";
    /** @type {Views[]}*/
    let viewStack = [view];

    /** @type {DatePickerCurrent} */
    let datePickerCurrent = {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    };
    /** @type {[number, number, number]} */
    let slotsOrder = [0, 1, 2];
    let itemsData = [{ monthCount: -1 }, { monthCount: 0 }, { monthCount: 1 }];

    /** @type {Settings | undefined} */
    let settings;
    /** @type {"edit" | null} */
    let footerMode = null;

    let editModeActiveIndex = -1;

    $: {
        if (view === "calendar") {
            settings = JSON.parse(
                localStorage.getItem("settings") || '{ "shifts": [], "startDate": "", "shiftRhythm": []}'
            );
        }
    }

    $: {
        if (footerMode !== "edit") {
            editModeActiveIndex = -1;
        }
    }

    function goBackInHistory() {
        if (viewStack.length === 1) return;
        viewStack.pop();
        viewStack = viewStack;
        view = viewStack[viewStack.length - 1];

        if (viewStack.length === 1) {
            slotsOrder = [0, 1, 2];
            goToMonth(new Date(datePickerCurrent.year, datePickerCurrent.month));
        }
    }

    /**
     *
     * @param {Views} v
     */
    function goTo(v) {
        footerMode = null;
        viewStack = [...viewStack, v];
        view = v;
    }

    /** @param {Date} date */
    function goToMonth(date) {
        const today = new Date();
        datePickerCurrent = {
            year: date.getFullYear(),
            month: date.getMonth(),
        };
        itemsData[slotsOrder[1]].monthCount =
            (date.getFullYear() - today.getFullYear()) * 12 + (date.getMonth() - today.getMonth());
        itemsData[slotsOrder[0]].monthCount = itemsData[slotsOrder[1]].monthCount - 1;
        itemsData[slotsOrder[2]].monthCount = itemsData[slotsOrder[1]].monthCount + 1;
        itemsData = itemsData;
    }

    // TODO: Need some handler (setTimeout) to update the today highlighting if its 12:00 AM

    onMount(() => {
        if (utils.isAndroid()) {
            App.addListener("backButton", () => goBackInHistory());
        }
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
        <DatePicker style="margin: 0; width: 30rem;" bind:current={datePickerCurrent} />
    {:else if view === "settings"}
        <h1 style="margin: 0; margin-left: 8px;">Settings</h1>
    {/if}

    <span class="spacer" />

    <div class="actions">
        {#if view === "calendar"}
            <!-- Edit Shifts -->
            <IconButton
                on:click={() => {
                    footerMode = footerMode === "edit" ? null : "edit";
                }}><MdModeEdit /></IconButton
            >

            <!-- GoTo Today -->
            <IconButton
                disabled={datePickerCurrent.year === new Date().getFullYear() &&
                    datePickerCurrent.month === new Date().getMonth()}
                on:click={() => goToMonth(new Date())}
            >
                <MdToday />
            </IconButton>

            <!-- Settings -->
            <IconButton on:click={() => goTo("settings")}><TiSpanner /></IconButton>
        {/if}
    </div>
</header>

<main class="container-fluid" style={`bottom: ${!!footerMode ? "60px" : "0"}`}>
    {#if view === "calendar"}
        <!-- Month view (infinite swipe) -->
        <InfiniteScrollView
            bind:slotsOrder
            on:scrollup={() => goToMonth(new Date(datePickerCurrent.year, datePickerCurrent.month - 1))}
            on:scrolldown={() => goToMonth(new Date(datePickerCurrent.year, datePickerCurrent.month + 1))}
        >
            <div style="width: 100%; height: 100%;" slot="0">
                <ViewCalendarContent
                    editMode={editModeActiveIndex === -2 ? { name: "" } : settings.shifts[editModeActiveIndex] || null}
                    monthCount={itemsData[0].monthCount}
                />
            </div>

            <div style="width: 100%; height: 100%;" slot="1">
                <ViewCalendarContent
                    editMode={editModeActiveIndex === -2 ? { name: "" } : settings.shifts[editModeActiveIndex] || null}
                    monthCount={itemsData[1].monthCount}
                />
            </div>

            <div style="width: 100%; height: 100%;" slot="2">
                <ViewCalendarContent
                    editMode={editModeActiveIndex === -2 ? { name: "" } : settings.shifts[editModeActiveIndex] || null}
                    monthCount={itemsData[2].monthCount}
                />
            </div>
        </InfiniteScrollView>
    {:else if view === "settings"}
        <SettingsView />
    {/if}
</main>

<footer class="container-fluid" class:visible={footerMode === "edit"}>
    {#if footerMode === "edit" && !!settings}
        <span>
            <Shift
                name="Reset"
                visible={false}
                active={editModeActiveIndex === -2}
                on:click={() => {
                    editModeActiveIndex = editModeActiveIndex === -2 ? -1 : -2;
                }}
            />
        </span>

        {#each settings.shifts as shift, index}
            <span>
                <Shift
                    {...shift}
                    active={editModeActiveIndex == index}
                    on:click={() => {
                        editModeActiveIndex = editModeActiveIndex === index ? -1 : index;
                    }}
                />
            </span>
        {/each}
    {/if}
</footer>

<style>
    :global(html, body) {
        overflow: hidden;
    }

    :global(button) {
        position: relative;
        overflow: hidden;
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
    }

    footer:not(.visible) {
        transform: translateY(100%);
    }
</style>
