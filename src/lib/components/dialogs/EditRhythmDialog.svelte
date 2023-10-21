<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";

    import { createEventDispatcher } from "svelte";

    import {
        Button,
        IconButton,
        Dialog,
        DialogHeader,
        DialogFooter,
    } from "svelte-css";

    import { Shift } from "../shift";

    import * as lang from "../../js/lang";

    import { createShiftSetupStore } from "../../stores/shift-setup-store";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog} */
    let dialog;

    /** @type {HTMLElement} */
    let scrollContainer;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /**
     * @type {import("../../stores/shift-setup-store").Shift[]}
     */
    let shifts = [];

    /**
     * @type {import("../../stores/shift-setup-store").ShiftID[]}
     */
    let rhythm = [];
    $: rhythm && setTimeout(scrollToBottom, 150);

    /*********************
     * Store: shift-setup
     *********************/

    let shiftSetup = createShiftSetupStore();

    /******************************
     * Function Export Definitions
     ******************************/

    /**
     * @param {import("../../stores/shift-setup-store").Shift[]} _shifts
     * @param {import("../../stores/shift-setup-store").ShiftID[]} _rhythm
     */
    export async function open(_shifts, _rhythm) {
        shifts = _shifts;
        rhythm = _rhythm;
        dialog.showModal();
    }

    export async function close() {
        dialog.close();
    }

    /***********************
     * Function Definitions
     ***********************/

    /**
     * @param {import("../../stores/shift-setup-store").ShiftID} id
     */
    async function getShiftForID(id) {
        return shiftSetup.getShiftForID(id);
    }

    async function scrollToBottom() {
        scrollContainer.scroll({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
        });
    }
</script>

<Dialog bind:this={dialog} fullscreen>
    <DialogHeader
        title={lang.get("rhythmDialog", "title")}
        on:close={() => dispatch("close")}
    />

    <section style="height: calc(100% - 7em);">
        <section
            bind:this={scrollContainer}
            style="height: calc(100% - 3.5em); overflow: auto;"
        >
            <table>
                <thead>
                    <tr>
                        <th class="left">Name</th>
                        <th class="left">Short</th>
                        <th class="left">Color</th>
                        <th class="left" />
                    </tr>
                </thead>

                <tbody>
                    {#each rhythm as id, index}
                        {#await getShiftForID(id) then shift}
                            {#if !!shift}
                                <tr>
                                    <td class="left">{shift.name}</td>
                                    <td class="left" style="width: 4em;">
                                        {shift.visible ? shift.shortName : ""}
                                    </td>
                                    <td
                                        class="left"
                                        style="color: {shift.color}; width: 6em;"
                                    >
                                        {shift.color}
                                    </td>
                                    <td class="right" style="width: 3em;">
                                        <IconButton
                                            on:click={async () => {
                                                rhythm = [
                                                    ...rhythm.slice(0, index),
                                                    ...rhythm.slice(index + 1),
                                                ];
                                            }}
                                        >
                                            <DeleteOutline />
                                        </IconButton>
                                    </td>
                                </tr>
                            {/if}
                        {/await}
                    {/each}
                </tbody>
            </table>
        </section>

        <section>
            <figure style="width: 100%;">
                <div class="row" style="flex-wrap: nowrap;">
                    {#each shifts as shift}
                        <div class="col" style="user-select: none;">
                            <Shift
                                {...shift}
                                on:click={() =>
                                    (rhythm = [...rhythm, shift.id])}
                            />
                        </div>
                    {/each}
                </div>
            </figure>
        </section>
    </section>

    <DialogFooter>
        <Button
            color="primary"
            type="submit"
            on:click={() => dispatch("submit", rhythm)}
        >
            {lang.get("buttons", "submit")}
        </Button>
    </DialogFooter>
</Dialog>

<style>
    figure {
        -moz-overflow-style: none;
        scrollbar-width: none;
    }

    figure::-webkit-scrollbar {
        display: none;
    }
</style>
