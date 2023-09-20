<script>
    import IoIosTrash from 'svelte-icons/io/IoIosTrash.svelte'
    import IoIosOpen from 'svelte-icons/io/IoIosOpen.svelte'

    import Shift, { ShiftAdd } from "../shift";
    import { EditRhythmDialog, AddShiftDialog, EditShiftDialog } from "../dialogs";
    import IconButton from "../icon-button";

    import * as settings from "../../js/settings";
    import * as db from "../../js/db";

    let { shifts, startDate, shiftRhythm, currentTheme, mode } = getSettings();
    $: (!!shifts || typeof startDate === "string" || !!shiftRhythm || !!currentTheme || !!mode) &&
        save();

    let addShiftDialogOpen = false;
    let editShiftRhythmDialogOpen = false;
    let editShiftDialogOpen = false;
    /** @type {string} */
    let editShiftDialogSelected;

    let themes = ["custom", "picocss", "green"];

    let dataStorage = false;

    /**
     * @returns {import(".").Settings}
     */
    function getSettings() {
        settings.load();
        return settings.data;
    }

    function save() {
        console.warn("saving data...");

        if (mode !== "auto") {
            document.documentElement.setAttribute("data-theme", mode);
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        settings.data.shifts = shifts;
        settings.data.startDate = startDate;
        settings.data.shiftRhythm = shiftRhythm;
        settings.data.currentTheme = currentTheme;
        settings.data.mode = mode;

        settings.save();
    }
</script>

<svelte:head>
    <link rel="stylesheet" href="/css/themes/{currentTheme}.min.css" />
</svelte:head>

<div class="_container">
    {#if addShiftDialogOpen}
        <AddShiftDialog
            on:cancel={() => (addShiftDialogOpen = false)}
            on:submit={({ detail }) => {
                addShiftDialogOpen = false;

                let id = 0;
                shifts.forEach((shift) => {
                    if (shift.id > id) id = shift.id;
                });
                detail.id = id + 1;

                if (!detail.name) {
                    return;
                }

                shifts = [...shifts, detail];
            }}
        />
    {/if}

    {#if editShiftDialogOpen}
        <EditShiftDialog
            {shifts}
            selected={editShiftDialogSelected}
            on:submit={({ detail }) => {
                editShiftDialogOpen = false;
                shifts = detail;
            }}
        />
    {/if}

    {#if editShiftRhythmDialogOpen}
        <EditRhythmDialog
            {shifts}
            rhythm={shiftRhythm}
            on:submit={({ detail }) => {
                editShiftRhythmDialogOpen = false;
                shiftRhythm = detail;
            }}
        />
    {/if}

    <article class="shift-scheduler">
        <div class="shifts">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Shifts</label>

            <ul class="shifts-available">
                {#each shifts as item, index}
                    <Shift
                        {...item}
                        on:click={() => {
                            editShiftDialogSelected = index.toString();
                            editShiftDialogOpen = true;
                        }}
                    />
                {/each}

                <ShiftAdd on:click={() => (addShiftDialogOpen = true)} />
            </ul>
        </div>

        <div class="spacer" />

        <label for="start-date">
            Start Date
            <input type="date" name="start-date" class="shift-start-date" bind:value={startDate} />
        </label>

        <div class="rhythm">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Rhythm</label>
            <button
                class="secondary"
                on:click={() => {
                    editShiftRhythmDialogOpen = true;
                }}
            >
                Edit
            </button>
        </div>
    </article>

    <article class="themes">
        <label>
            Themes
            <select bind:value={currentTheme}>
                {#each themes as theme}
                    <option value={theme}>{theme}</option>
                {/each}
            </select>
        </label>

        <fieldset>
            <legend>Mode</legend>

            <label>
                <input
                    type="radio"
                    value="auto"
                    checked={mode === "auto"}
                    on:change={() => (mode = "auto")}
                />
                Auto
            </label>

            <label>
                <input
                    type="radio"
                    value="dark"
                    checked={mode === "dark"}
                    on:change={() => (mode = "dark")}
                />
                Dark
            </label>

            <label>
                <input
                    type="radio"
                    value="light"
                    checked={mode === "light"}
                    on:change={() => (mode = "light")}
                />
                Light
            </label>
        </fieldset>
    </article>

    <article class="data-storage">
        <figure>
            <section>
                <h2>Data Storage</h2>
                {#if dataStorage}
                    <figure>
                        <table role="grid">
                            <thead>
                                <tr>
                                    <th scope="col">Year</th>
                                    <th scope="col">Month</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each db.list() as key}
                                    <tr>
                                        <td>{key.getFullYear()}</td>
                                        <td>{key.getMonth()+1}</td>
                                        <td class="actions">
                                            <div>
                                                <IconButton
                                                    margin="4px 8px"
                                                    disabled
                                                >
                                                    <IoIosOpen />
                                                </IconButton>

                                                <IconButton
                                                    margin="4px 8px"
                                                >
                                                    <IoIosTrash />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </figure>
                {:else}
                    <button
                        on:click={() => {
                            dataStorage = true;
                        }}
                    >
                        Load Data
                    </button>
                {/if}
            </section>
        </figure>
    </article>
</div>

<style>
    .spacer {
        border-bottom: 1px solid var(--muted-border-color);
    }

    div._container {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: var(--spacing);
    }

    div._container::-webkit-scrollbar {
        display: none;
    }

    div._container {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    article.shift-scheduler .shifts {
        position: relative;
    }

    article.shift-scheduler .shifts > label {
        margin-bottom: 16px;
    }

    article.shift-scheduler .rhythm {
        display: flex;
        justify-content: space-between;
        border-bottom: none;
    }

    article.shift-scheduler .rhythm button {
        width: fit-content;
    }

    article.themes fieldset label {
        display: inline-block;
        margin: calc(var(--spacing) / 2);
        user-select: none;
    }

    article.data-storage {
        padding-bottom: 0;
    }

    article.data-storage table .actions > div {
        width: 100%;
        height: 100%;

        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    article.data-storage table .actions button {
        display: inline !important;
        width: 100%;
        margin: 0;
    }
</style>
