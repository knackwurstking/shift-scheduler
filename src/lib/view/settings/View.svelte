<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";
    import Upload from "svelte-material-icons/Upload.svelte";
    import Download from "svelte-material-icons/Download.svelte";
    import OpenInNew from "svelte-material-icons/OpenInNew.svelte";
    import PencilOutline from "svelte-material-icons/PencilOutline.svelte";

    import {
        Button,
        Text,
        Input,
    } from "svelte-css";

    import {
        ShiftDialog,
        EditRhythmDialog,
        StorageDialog,
    } from "../../components";

    import { createThemeStore } from "../../stores/theme-store";
    import { createShiftSetupStore } from "../../stores/shift-setup-store";
    import { createWeekStartStore } from "../../stores/week-start-store";

    import * as lang from "../../js/lang";
    import * as db from "../../js/db";
    import * as utils from "../../js/utils";

    /***********
     * Bindings
     ***********/

    /** @type {StorageDialog} */
    let storageDialog;

    /** @type {ShiftDialog} */
    let shiftDialog;

    /** @type {EditRhythmDialog} */
    let editRhythmDialog;

    /************************
     * Variable Definitions
     ************************/

    let dataStorage = false;
    let reloadDataStorageTable = false;
    let tableRowHovering = null;

    /***************
     * Store: theme
     ***************/

    const theme = createThemeStore();

    /*********************
     * Store: shift-setup
     *********************/

    const shiftSetup = createShiftSetupStore();

    /********************
     * Store: week-start
     ********************/

    const weekStart = createWeekStartStore();

    /***********************
     * Function Definitions
     ***********************/

    async function storageFileUpload() {
        const input = document.createElement("input");

        input.type = "file";

        input.onchange = async () => {
            const r = new FileReader();

            r.onload = async () => {
                if (typeof r.result === "string") {
                    try {
                        const result = JSON.parse(r.result);

                        for (const [key, dbData] of Object.entries(result)) {
                            if (!db.validate(dbData)) {
                                console.error(
                                    `Data Upload: data "${key}" invalid`,
                                    dbData
                                );
                                return;
                            }

                            await utils.mergeDataWithShifts(dbData);
                        }

                        for (const [key, dbData] of Object.entries(result)) {
                            const keySplit = key.split("-", 3);
                            const year = parseInt(keySplit[1], 10);
                            const month = parseInt(keySplit[2], 10);
                            await db.set(year, month, dbData);
                        }

                        if (dataStorage) dataStorage = false;
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
    }

    async function storageFileDownload() {
        const data = await db.getAll();
        try {
            await db.exportDatabase(
                data,
                utils.isAndroid() ? "android" : "browser"
            );
        } catch (err) {
            alert(`Data download failed!\n${err}`);
        }
    }
</script>

<div class="root">
    <article class="card">
        <section style="padding-left: 0; padding-right: 0;">
            <h2>{lang.get("settingsView", "titleShifts")}</h2>

            <hr />

            <figure>
                <table class="shift-table">
                    <thead>
                        <tr>
                            <th class="left">
                                {lang.get("settingsView", "tableHeaderName")}
                            </th>
                            <th class="left">
                                {lang.get("settingsView", "tableHeaderShort")}
                            </th>
                            <th class="left">
                                {lang.get("settingsView", "tableHeaderColor")}
                            </th>
                            <th class="right" />
                        </tr>
                    </thead>

                    <tbody>
                        {#each $shiftSetup.shifts as item, index}
                            <tr
                                style:background-color={tableRowHovering ===
                                index
                                    ? "hsl(var(--primary))"
                                    : undefined}
                                style:color={tableRowHovering === index
                                    ? "hsl(var(--primary-foreground))"
                                    : undefined}
                                draggable={true}
                                on:dragstart={(ev) => {
                                    ev.dataTransfer.effectAllowed = "move";
                                    ev.dataTransfer.dropEffect = "move";
                                    ev.dataTransfer.setData(
                                        "text/plain",
                                        index.toString()
                                    );
                                }}
                                on:drop|preventDefault={(ev) => {
                                    ev.dataTransfer.dropEffect = "move";

                                    const startIndex = parseInt(
                                        ev.dataTransfer.getData("text/plain"),
                                        10
                                    );

                                    shiftSetup.update((setup) => {
                                        if (startIndex < index) {
                                            // dragged down
                                            setup.shifts = [
                                                ...setup.shifts.slice(
                                                    0,
                                                    startIndex
                                                ),
                                                ...setup.shifts.slice(
                                                    startIndex + 1,
                                                    index + 1
                                                ),
                                                setup.shifts[startIndex],
                                                ...setup.shifts.slice(
                                                    index + 1
                                                ),
                                            ];
                                        } else {
                                            // dragged up
                                            setup.shifts = [
                                                ...setup.shifts.slice(0, index),
                                                setup.shifts[startIndex],
                                                ...setup.shifts.slice(
                                                    index,
                                                    startIndex
                                                ),
                                                ...setup.shifts.slice(
                                                    startIndex + 1
                                                ),
                                            ];
                                        }

                                        return setup;
                                    });

                                    tableRowHovering = null;
                                }}
                                on:dragover|preventDefault={() => false}
                                on:dragenter|preventDefault={() =>
                                    (tableRowHovering = index)}
                            >
                                <td class="left">{item.name}</td>

                                <td class="left">
                                    {item.visible ? item.shortName : ""}
                                </td>

                                <td
                                    class="left"
                                    style="color: {item.color}; font-weight: 600;"
                                >
                                    {!item.color || item.color === "transparent"
                                        ? ""
                                        : item.color}
                                </td>

                                <td class="right" style="font-size: 1.1em;">
                                    <Button.Icon
                                        style="margin: 4px;"
                                        on:click={async () => {
                                            shiftDialog.open(item);
                                        }}
                                    >
                                        <PencilOutline />
                                    </Button.Icon>

                                    <Button.Icon
                                        style="margin: 4px;"
                                        color="destructive"
                                        on:click={async (ev) => {
                                            ev.stopPropagation();
                                            if (
                                                window.confirm(
                                                    `Delete shift "${item.name}"?`
                                                )
                                            ) {
                                                shiftSetup.update((setup) => {
                                                    return {
                                                        ...setup,
                                                        shifts: [
                                                            ...setup.shifts.slice(
                                                                0,
                                                                index
                                                            ),
                                                            ...setup.shifts.slice(
                                                                index + 1
                                                            ),
                                                        ],
                                                    };
                                                });
                                            }
                                        }}
                                    >
                                        <DeleteOutline />
                                    </Button.Icon>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </figure>
        </section>

        <section>
            <Button.Root
                color="primary"
                style="width: 100%;"
                on:click={async () => shiftDialog.open()}
            >
                {lang.get("settingsView", "addShiftButton")}
            </Button.Root>
        </section>

        <hr />

        <section>
            <Text.Label
                primary={lang.get("settingsView", "startDatePrimaryText")}
                row
            >
                <Input.Date
                    value={$shiftSetup.startDate}
                    on:input={(ev) => {
                        // @ts-ignore
                        shiftSetup.updateStartDate(ev.currentTarget.value);
                    }}
                />
            </Text.Label>
        </section>

        <hr />

        <section>
            <Text.Label
                primary={lang.get("settingsView", "rhythmPrimaryText")}
                row
            >
                <Button.Root
                    disabled={!$shiftSetup.shifts.length}
                    on:click={async () => {
                        editRhythmDialog.open(
                            $shiftSetup.shifts,
                            $shiftSetup.rhythm.filter(
                                (id) =>
                                    !!$shiftSetup.shifts.find(
                                        (s) => s.id === id
                                    )
                            )
                        );
                    }}
                >
                    {lang.get("buttons", "edit")}
                </Button.Root>
            </Text.Label>
        </section>
    </article>

    <article class="card">
        <h2 style="margin: var(--spacing)">
            {lang.get("settingsView", "titleMisc")}
        </h2>

        <hr />

        <section>
            <Text.Label
                primary={lang.get("settingsView", "miscThemePrimaryText")}
                row
            >
                <Input.Select
                    items={[
                        { value: "system", label: "System" },
                        { value: "dark", label: "Dark" },
                        { value: "light", label: "Light" },
                    ]}
                    selected={{
                        value: $theme,
                        label: $theme.charAt(0).toUpperCase() + $theme.slice(1)
                    }}
                    on:change={ev => theme.set(ev.detail.value)}
                />
            </Text.Label>
        </section>

        <hr />

        <section>
            <Text.Label
                style="cursor: pointer;"
                primary={lang.get(
                    "settingsView",
                    "miscWeekStartPrimaryText"
                )}
                useLabel
                row
            >
                <input
                    style={`
                        transform: scale(1.25);
                    `}
                    type="checkbox"
                    checked={$weekStart === "mon"}
                    on:change={(ev) => {
                        if (ev.currentTarget.checked) weekStart.monday();
                        else weekStart.sunday();
                    }}
                />
            </Text.Label>
        </section>
    </article>

    <article class="card">
        <h2 style="margin: var(--spacing)">
            {lang.get("settingsView", "titleStorage")}
        </h2>

        <hr />

        <section>
            <Text.Label
                primary={lang.get("settingsView", "labelupdownPrimaryText")}
                secondary={lang.get(
                    "settingsView",
                    "labelupdownSecondaryText"
                )}
                row
            >
                <Button.Icon
                    style="margin: calc(var(--spacing) / 2)"
                    on:click={() => storageFileUpload()}
                >
                    <Upload />
                </Button.Icon>
                <Button.Icon
                    style="margin: calc(var(--spacing) / 2)"
                    on:click={() => storageFileDownload()}
                >
                    <Download />
                </Button.Icon>
            </Text.Label>
        </section>

        <hr />

        {#if dataStorage}
            <section>
                <figure>
                    <table class="storage-data-table">
                        <thead>
                            <tr>
                                <th class="left">
                                    {lang.get(
                                        "settingsView",
                                        "tableHeaderYear"
                                    )}
                                </th>
                                <th class="left">
                                    {lang.get(
                                        "settingsView",
                                        "tableHeaderMonth"
                                    )}
                                </th>
                                <th class="left" />
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
                                        <td
                                            class="actions right"
                                            style="font-size: 1.1em;"
                                        >
                                            <Button.Icon
                                                style={`
                                                    margin: 4px;
                                                `}
                                                on:click={async () => {
                                                    storageDialog.open(
                                                        item.year,
                                                        item.month
                                                    );
                                                }}
                                            >
                                                <OpenInNew />
                                            </Button.Icon>

                                            <Button.Icon
                                                style={`
                                                    margin: 4px;
                                                `}
                                                color="destructive"
                                                on:click={async () => {
                                                    const yes = window.confirm(
                                                        `Delete all data for "${
                                                            item.year
                                                        }/${(item.month + 1)
                                                            .toString()
                                                            .padStart(
                                                                2,
                                                                "0"
                                                            )}" ?`
                                                    );
                                                    if (yes) {
                                                        await db.remove(
                                                            item.year,
                                                            item.month
                                                        );
                                                        reloadDataStorageTable =
                                                            !reloadDataStorageTable;
                                                    }
                                                }}
                                            >
                                                <DeleteOutline />
                                            </Button.Icon>
                                        </td>
                                    </tr>
                                {/each}
                            {/key}
                        </tbody>
                    </table>
                </figure>
            </section>
        {:else}
            <section>
                <Button.Root color="secondary" on:click={() => (dataStorage = true)}>
                    {lang.get("settingsView", "storageFetchDataButton")}
                </Button.Root>
            </section>
        {/if}
    </article>
</div>

<EditRhythmDialog
    bind:this={editRhythmDialog}
    on:close={async () => editRhythmDialog.close()}
    on:submit={async ({ detail }) => {
        editRhythmDialog.close();
        shiftSetup.updateRhythm(detail);
    }}
/>

<ShiftDialog
    bind:this={shiftDialog}
    on:close={async () => shiftDialog.close()}
    on:submit={async (ev) => {
        shiftDialog.close();

        /** @type {import("../../stores/shift-setup-store").Shift} */
        const shift = ev.detail;

        if (!shift.name) return;

        if (shift.id) shiftSetup.updateShift(shift);
        else
            shiftSetup.update((setup) => {
                shift.id = new Date().getTime();
                return {
                    ...setup,
                    shifts: [...setup.shifts, shift],
                };
            });
    }}
/>

<StorageDialog
    bind:this={storageDialog}
    on:close={async () => {
        storageDialog.close();
    }}
/>

<style>
    div.root {
        height: 100%;
        overflow: hidden;
        overflow-y: auto;

        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    div.root::-webkit-scrollbar {
        display: none;
    }

    .shift-table tr > *:nth-child(2) {
        width: 4.5em;
    }

    .shift-table tr > *:nth-child(3) {
        width: 6em;
    }

    .shift-table tr > *:nth-child(4) {
        width: 6.75em;
    }

    .storage-data-table tr > *:last-child {
        width: 6.75em;
    }
</style>
