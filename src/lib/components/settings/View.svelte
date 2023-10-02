<script>
    // @ts-ignore
    import IoIosTrash from "svelte-icons/io/IoIosTrash.svelte";
    // @ts-ignore
    import IoIosOpen from "svelte-icons/io/IoIosOpen.svelte";
    // @ts-ignore
    import FaUpload from "svelte-icons/fa/FaUpload.svelte";
    // @ts-ignore
    import FaDownload from "svelte-icons/fa/FaDownload.svelte";

    import { AddShiftDialog, EditRhythmDialog, EditShiftDialog, StorageDialog } from "../dialogs";
    import IconButton from "../icon-button";
    import Shift, { ShiftAdd } from "../shift";

    import * as db from "../../js/db";
    import * as settings from "../../js/settings";
    import * as utils from "../../js/utils";

    /** @type {StorageDialog} */
    let storageDialog;
    /** @type {AddShiftDialog} */
    let addShiftDialog;
    /** @type {EditShiftDialog} */
    let editShiftDialog;
    /** @type {EditRhythmDialog} */
    let editRhythmDialog;

    /** @type {import(".").Settings} */
    let data;
    $: (!data && initSettings()) || save();

    let themes = ["custom", "picocss"];

    let dataStorage = false;
    let reloadDataStorageTable = false;

    async function initSettings() {
        await settings.load();
        data = settings.data;
    }

    async function save() {
        console.warn("saving data...");

        if (data.mode !== "auto") {
            document.documentElement.setAttribute("data-theme", data.mode);
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        await settings.save(data);
    }
</script>

<svelte:head>
    {#if !!data}
        <link rel="stylesheet" href="/css/themes/{data.currentTheme}.min.css" />
    {/if}
</svelte:head>

<div class="container">
    {#if !!data}
        <article class="shift-scheduler">
            <div class="shifts">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Shifts</label>

                <ul class="shifts-available">
                    {#each data.shifts as item, index}
                        <Shift
                            {...item}
                            on:click={async () => {
                                editShiftDialog.open(data.shifts, index.toString());
                            }}
                        />
                    {/each}

                    <ShiftAdd on:click={async () => addShiftDialog.open()} />
                </ul>
            </div>

            <div class="spacer" />

            <label for="start-date">
                Start Date
                <input
                    type="date"
                    name="start-date"
                    class="shift-start-date"
                    bind:value={data.startDate}
                />
            </label>

            <div class="rhythm">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Rhythm</label>
                <button
                    class="secondary"
                    on:click={async () => {
                        editRhythmDialog.open(data.shifts, data.shiftRhythm);
                    }}
                >
                    Edit
                </button>
            </div>
        </article>

        <article class="themes">
            <label>
                Themes
                <select bind:value={data.currentTheme}>
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
                        checked={data.mode === "auto"}
                        on:change={async () => (data.mode = "auto")}
                    />
                    Auto
                </label>

                <label>
                    <input
                        type="radio"
                        value="dark"
                        checked={data.mode === "dark"}
                        on:change={async () => (data.mode = "dark")}
                    />
                    Dark
                </label>

                <label>
                    <input
                        type="radio"
                        value="light"
                        checked={data.mode === "light"}
                        on:change={async () => (data.mode = "light")}
                    />
                    Light
                </label>
            </fieldset>
        </article>

        <article class="data-storage">
            <h2>Data Storage</h2>

            <div class="button-group">
                <button
                    class="upload secondary outline"
                    on:click={async () => {
                        const input = document.createElement("input");

                        input.type = "file";

                        input.onchange = async () => {
                            const r = new FileReader();

                            r.onload = async () => {
                                if (typeof r.result === "string") {
                                    try {
                                        const data = JSON.parse(r.result);

                                        for (const [k, v] of Object.entries(data)) {
                                            if (!db.validate(v)) {
                                                console.error(
                                                    `Data Upload: data "${k}" invalid`,
                                                    v
                                                );
                                                return;
                                            }
                                        }

                                        for (const [k, v] of Object.entries(data)) {
                                            const ks = k.split("-", 3);
                                            const year = parseInt(ks[1], 10);
                                            const month = parseInt(ks[2], 10);
                                            await db.set(year, month, v);
                                        }
                                    } catch (err) {
                                        alert(`Data upload failed!\n${err}`);
                                    }
                                }
                            };

                            r.onerror = async (ev) => {
                                console.error("Data Upload: Read file failed:", ev);
                            };

                            r.readAsText(input.files[0]);
                        };

                        input.click();
                    }}
                >
                    <FaDownload />
                </button>

                <button
                    class="download secondary outline"
                    on:click={async () => {
                        const data = await db.getAll();
                        try {
                            await db.exportDatabase(
                                data,
                                utils.isAndroid() ? "android" : "browser"
                            );
                        } catch (err) {
                            alert(`Data download failed!\n${err}`);
                        }
                    }}
                >
                    <FaUpload />
                </button>
            </div>

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
                                {#each db
                                    .listKeys()
                                    .sort((a, b) => (a.year > b.year ? 1 : -1))
                                    .sort( (a, b) => (a.month > b.month && a.year === b.year ? 1 : -1) ) as item}
                                    <tr>
                                        <td>{item.year}</td>
                                        <td>{item.month + 1}</td>
                                        <td class="actions">
                                            <IconButton
                                                style={`
                                                    margin: 4px;
                                                `}
                                                on:click={async () => {
                                                    storageDialog.open(item.year, item.month);
                                                }}
                                            >
                                                <IoIosOpen />
                                            </IconButton>

                                            <IconButton
                                                style={`
                                                    margin: 4px;
                                                `}
                                                on:click={async () => {
                                                    const yes = window.confirm(
                                                        `Delete all data for "${item.year}/${(
                                                            item.month + 1
                                                        )
                                                            .toString()
                                                            .padStart(2, "0")}" ?`
                                                    );
                                                    if (yes) {
                                                        await db.remove(item.year, item.month);
                                                        reloadDataStorageTable =
                                                            !reloadDataStorageTable;
                                                    }
                                                }}
                                            >
                                                <IoIosTrash />
                                            </IconButton>
                                        </td>
                                    </tr>
                                {/each}
                            {/key}
                        </tbody>
                    </table>
                </figure>
            {:else}
                <button
                    class="load-data"
                    on:click={async () => {
                        dataStorage = true;
                    }}
                >
                    Load Data
                </button>
            {/if}
        </article>
    {/if}
</div>

<EditShiftDialog
    bind:this={editShiftDialog}
    on:cancel={() => {
        editShiftDialog.close();
    }}
    on:submit={async ({ detail }) => {
        editShiftDialog.close();

        data.shifts = detail;
    }}
/>

<EditRhythmDialog
    bind:this={editRhythmDialog}
    on:cancel={() => {
        editRhythmDialog.close();
    }}
    on:submit={async ({ detail }) => {
        editRhythmDialog.close();

        data.shiftRhythm = detail;
    }}
/>

<AddShiftDialog
    bind:this={addShiftDialog}
    on:cancel={async () => {
        addShiftDialog.close();
    }}
    on:submit={async (ev) => {
        addShiftDialog.close();
        const newShift = ev.detail;
        if (!newShift.name) return;
        newShift.id = new Date().getTime();
        data.shifts = [...data.shifts, newShift];
    }}
/>

<StorageDialog
    bind:this={storageDialog}
    on:close={async () => {
        storageDialog.close();
    }}
/>

<style>
    .spacer {
        border-bottom: 1px solid var(--muted-border-color);
    }

    div.container {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: var(--spacing);
    }

    div.container::-webkit-scrollbar {
        display: none;
    }

    div.container {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    div.container article.shift-scheduler .shifts {
        position: relative;
    }

    div.container article.shift-scheduler .shifts > label {
        margin-bottom: 16px;
    }

    div.container article.shift-scheduler .rhythm {
        display: flex;
        justify-content: space-between;
        border-bottom: none;
    }

    div.container article.shift-scheduler .rhythm button {
        width: fit-content;
    }

    div.container article.themes fieldset label {
        display: inline-block;
        margin: calc(var(--spacing) / 2);
        user-select: none;
    }

    div.container article.data-storage {
        position: relative;
    }

    div.container article.data-storage > h2 {
        max-width: calc(100% - 120px - 1rem);
    }

    div.container article.data-storage .button-group {
        position: absolute;
        top: 1rem;
        right: 1rem;
        margin-top: var(--block-spacing-vertical);

        display: flex;
    }

    div.container article.data-storage .button-group button {
        border-radius: 0;
        width: 60px;
        height: 40px;
        padding: 4px;
        box-shadow: var(--button-box-shadow);
    }

    div.container article.data-storage .button-group button:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
    }

    div.container article.data-storage .button-group button:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }

    div.container article.data-storage table .actions {
        position: relative;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
    }
</style>
