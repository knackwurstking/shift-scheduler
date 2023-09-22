<script>
    import IoIosTrash from "svelte-icons/io/IoIosTrash.svelte";
    import IoIosOpen from "svelte-icons/io/IoIosOpen.svelte";

    import Shift, { ShiftAdd } from "../shift";
    import { EditRhythmDialog, AddShiftDialog, EditShiftDialog, StorageDialog } from "../dialogs";

    import * as settings from "../../js/settings";
    import * as db from "../../js/db";
    import * as ripple from "../../js/ripple";

    let { shifts, startDate, shiftRhythm, currentTheme, mode } = getSettings();
    $: (!!shifts || typeof startDate === "string" || !!shiftRhythm || !!currentTheme || !!mode) &&
        save();

    let addShiftDialogOpen = false;
    let editShiftRhythmDialogOpen = false;
    let editShiftDialogOpen = false;
    /** @type {string} */
    let editShiftDialogSelected;

    let themes = ["custom", "picocss"];

    let dataStorage = false;
    let reloadDataStorageTable = false;

    let storageDialog_open = false;
    /** @type {number} */
    let storageDialog_year;
    /** @type {number} */
    let storageDialog_month;

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

    {#if storageDialog_open}
        <StorageDialog
            year={storageDialog_year}
            month={storageDialog_month}
            on:click={() => {
                storageDialog_open = false;
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
                                {#key reloadDataStorageTable}
                                    {#each db.list() as key}
                                        <tr>
                                            <td>{key.getFullYear()}</td>
                                            <td>{key.getMonth() + 1}</td>
                                            <td class="actions">
                                                <div>
                                                    <button
                                                        class="outline contrast"
                                                        on:pointerdown={(ev) => {
                                                            if (ev.buttons === 1) {
                                                                ripple.add(ev, ev.currentTarget);
                                                            }
                                                        }}
                                                        on:click={(ev) => {
                                                            storageDialog_year = key.getFullYear();
                                                            storageDialog_month = key.getMonth();
                                                            storageDialog_open = true;
                                                        }}
                                                    >
                                                        <IoIosOpen />
                                                    </button>

                                                    <button
                                                        class="outline contrast"
                                                        on:pointerdown={(ev) => {
                                                            if (ev.buttons === 1) {
                                                                ripple.add(ev, ev.currentTarget);
                                                            }
                                                        }}
                                                        on:click={() => {
                                                            const yes = window.confirm(
                                                                `Delete all data for "${key.getFullYear()}/${(
                                                                    key.getMonth() + 1
                                                                )
                                                                    .toString()
                                                                    .padStart(2, "0")}" ?`
                                                            );
                                                            if (yes) {
                                                                db.remove(
                                                                    key.getFullYear(),
                                                                    key.getMonth()
                                                                );
                                                                reloadDataStorageTable =
                                                                    !reloadDataStorageTable;
                                                            }
                                                        }}
                                                    >
                                                        <IoIosTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                {/key}
                            </tbody>
                        </table>
                    </figure>
                {:else}
                    <button
                        class="primary"
                        on:pointerdown={(ev) => {
                            if (ev.buttons === 1) {
                                ripple.add(ev, ev.currentTarget);
                            }
                        }}
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
        position: relative;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    article.data-storage table .actions button {
        margin: 4px 8px;
        width: 32px;
        height: 32px;
        padding: 0;
    }
</style>
