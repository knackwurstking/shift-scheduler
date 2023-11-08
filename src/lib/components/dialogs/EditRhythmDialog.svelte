<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";

    import { createEventDispatcher } from "svelte";

    import {
        Button,
        Dialog,
    } from "svelte-css";

    import { createViewStore } from "../../stores/view-store.js";
    import { createShiftSetupStore } from "../../stores/shift-setup-store";

    import * as lang from "../../js/lang";

    import { Shift } from "../shift";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog.Root} */
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

    /**************
     * Store: view
     **************/

    const view = createViewStore();

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
        view.lock();
    }

    export async function close() {
        dialog.close();
        view.unlock();
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

<Dialog.Root bind:this={dialog} fullscreen>
    <Dialog.Header
        title={lang.get("rhythmDialog", "title")}
        on:close={() => close()}
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
                                        <Button.Icon
                                            on:click={async () => {
                                                rhythm = [
                                                    ...rhythm.slice(0, index),
                                                    ...rhythm.slice(index + 1),
                                                ];
                                            }}
                                        >
                                            <DeleteOutline />
                                        </Button.Icon>
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
                        <div class="col no-user-select">
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

    <Dialog.Footer>
        <Button.Root
            color="primary"
            type="submit"
            on:click={() => dispatch("submit", rhythm)}
        >
            {lang.get("buttons", "submit")}
        </Button.Root>
    </Dialog.Footer>
</Dialog.Root>

<style>
    figure {
        -moz-overflow-style: none;
        scrollbar-width: none;
    }

    figure::-webkit-scrollbar {
        display: none;
    }
</style>
