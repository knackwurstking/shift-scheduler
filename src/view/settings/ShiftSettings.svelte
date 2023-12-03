<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";
    import PencilOutline from "svelte-material-icons/PencilOutline.svelte";

    import {
        Button,
        Text,
        Input,
    } from "svelte-css";

    import {
        ShiftDialog,
        EditRhythmDialog,
    } from "../../lib/components";

    import * as Store from "../../lib/stores";

    import * as lang from "../../lib/js/lang";

    /***********
     * Bindings
     ***********/

    /** @type {ShiftDialog} */
    let shiftDialog;

    /** @type {EditRhythmDialog} */
    let editRhythmDialog;

    /************************
     * Variable Definitions
     ************************/

    let tableRowHovering = null;

    /*********************
     * Store: shift-setup
     *********************/

    const shiftSetup = Store.shiftSetup.create();
</script>

<article class="ui-card has-margin">
    <section>
        <h3>{lang.get("settingsView", "titleShifts")}</h3>

        <hr />

        <figure class="is-max-width">
            <table class="shift-table is-max-width">
                <thead>
                    <tr>
                        <th class="is-text-left">
                            {lang.get("settingsView", "tableHeaderName")}
                        </th>
                        <th class="is-text-left">
                            {lang.get("settingsView", "tableHeaderShort")}
                        </th>
                        <th class="is-text-right" />
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
                                ? "hsl(var(--primary-fg))"
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
                            <td class="is-text-left">{item.name}</td>

                            <td
                                class="is-text-left"
                                style={
                                    `--shift-color: ${item.color || "hsl(var(--fg))"}`
                                }
                            >
                                {item.visible ? item.shortName : ""}
                            </td>

                            <td class="is-text-right" style="font-size: 1.1em;">
                                <Button.Icon
                                    style="margin: 4px;"
                                    ghost
                                    on:click={async () => {
                                        shiftDialog.open(item);
                                    }}
                                >
                                    <PencilOutline />
                                </Button.Icon>

                                <Button.Icon
                                    style="margin: 4px;"
                                    color="destructive"
                                    ghost
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
            class="is-max-width"
            color="primary"
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

        /** @type {import("../../lib/stores/shift-setup").Shift} */
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

<style>
    .shift-table tr > *:nth-child(2) {
        width: 4.5em;
        color: var(--shift-color);
        text-shadow: .1em .1em .1em hsl(var(--border));
    }

    .shift-table tr > *:nth-child(3) {
        width: calc(6em + (4px * 4) + (var(--spacing) * 2));
    }
</style>
