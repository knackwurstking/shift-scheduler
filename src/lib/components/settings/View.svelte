<script>
    // @ts-ignore
    import IoIosTrash from "svelte-icons/io/IoIosTrash.svelte";
    // @ts-ignore
    import IoIosOpen from "svelte-icons/io/IoIosOpen.svelte";
    // @ts-ignore
    import FaUpload from "svelte-icons/fa/FaUpload.svelte";
    // @ts-ignore
    import FaDownload from "svelte-icons/fa/FaDownload.svelte";

    import Shift, { ShiftAdd } from "../shift";
    import { EditRhythmDialog, AddShiftDialog, EditShiftDialog, StorageDialog } from "../dialogs";
    import IconButton from "../icon-button";

    import * as utils from "../../js/utils";
    import * as settings from "../../js/settings";
    import * as db from "../../js/db";
    import { ripple } from "../../js/ripple";
    let _ripple = ripple({ usePointer: true });
    let _primaryRipple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });
    let _secondaryRipple = ripple({ color: "var(--ripple-secondary-color)", usePointer: true });

    /** @type {StorageDialog} */
    let storageDialog;

    /** @type {import(".").Settings} */
    let data;
    $: (!data && initSettings()) || save();

    let addShiftDialogOpen = false;
    let editShiftRhythmDialogOpen = false;
    let editShiftDialogOpen = false;
    /** @type {string} */
    let editShiftDialogSelected;

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

<div class="_container">
    {#if addShiftDialogOpen}
        <AddShiftDialog
            on:cancel={async () => (addShiftDialogOpen = false)}
            on:submit={async ({ detail }) => {
                addShiftDialogOpen = false;

                let id = 0;
                data.shifts.forEach((shift) => {
                    if (shift.id > id) id = shift.id;
                });
                detail.id = id + 1;

                if (!detail.name) {
                    return;
                }

                data.shifts = [...data.shifts, detail];
            }}
        />
    {/if}

    {#if editShiftDialogOpen}
        <EditShiftDialog
            shifts={data.shifts}
            selected={editShiftDialogSelected}
            on:submit={async ({ detail }) => {
                editShiftDialogOpen = false;
                data.shifts = detail;
            }}
        />
    {/if}

    {#if editShiftRhythmDialogOpen}
        <EditRhythmDialog
            shifts={data.shifts}
            rhythm={data.shiftRhythm}
            on:submit={async ({ detail }) => {
                editShiftRhythmDialogOpen = false;
                data.shiftRhythm = detail;
            }}
        />
    {/if}

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
                                editShiftDialogSelected = index.toString();
                                editShiftDialogOpen = true;
                            }}
                        />
                    {/each}

                    <ShiftAdd on:click={async () => (addShiftDialogOpen = true)} />
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
                    use:_secondaryRipple
                    on:click={async () => {
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
                    use:_ripple
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
                                            if (!db.validateDBData(v)) {
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
                    use:_ripple
                    on:click={async () => {
                        const data = await db.getAll();
                        try {
                            await db.exportAllData(data, utils.isAndroid() ? "android" : "browser");
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
                                    .list()
                                    .sort((a, b) => (a.getFullYear() > b.getFullYear() ? 1 : -1))
                                    .sort( (a, b) => (a.getMonth() > b.getMonth() && a.getFullYear() === b.getFullYear() ? 1 : -1) ) as item}
                                    <tr>
                                        <td>{item.getFullYear()}</td>
                                        <td>{item.getMonth() + 1}</td>
                                        <td class="actions">
                                            <IconButton
                                                style={`
                                                    margin: 4px;
                                                `}
                                                on:click={async () => {
                                                    storageDialog.open(item.getFullYear(), item.getMonth());
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
                                                        `Delete all data for "${item.getFullYear()}/${(
                                                            item.getMonth() + 1
                                                        )
                                                            .toString()
                                                            .padStart(2, "0")}" ?`
                                                    );
                                                    if (yes) {
                                                        await db.remove(
                                                            item.getFullYear(),
                                                            item.getMonth()
                                                        );
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
                    use:_primaryRipple
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
        position: relative;
    }

    article.data-storage > h2 {
        max-width: calc(100% - 120px - 1rem);
    }

    article.data-storage .button-group {
        position: absolute;
        top: 1rem;
        right: 1rem;
        margin-top: var(--block-spacing-vertical);

        display: flex;
    }

    article.data-storage .button-group button {
        border-radius: 0;
        width: 60px;
        height: 40px;
        padding: 4px;
        box-shadow: var(--button-box-shadow);
    }

    article.data-storage .button-group button:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
    }

    article.data-storage .button-group button:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }

    article.data-storage table .actions {
        position: relative;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
    }
</style>
