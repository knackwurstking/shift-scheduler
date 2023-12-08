<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";

    import { createEventDispatcher } from "svelte";

    import {
        Button,
        Dialog,
        FlexGrid,
    } from "svelte-css";

    import * as Store from "../../stores";

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
     * @type {import("../../stores/shift-setup").Shift[]}
     */
    let shifts = [];

    /**
     * @type {import("../../stores/shift-setup").ShiftID[]}
     */
    let rhythm = [];
    $: rhythm && setTimeout(scrollToBottom, 150);

    /**************
     * Store: view
     **************/

    const view = Store.view.create();

    /*********************
     * Store: shift-setup
     *********************/

    let shiftSetup = Store.shiftSetup.create();

    /******************************
     * Function Export Definitions
     ******************************/

    /**
     * @param {import("../../stores/shift-setup").Shift[]} _shifts
     * @param {import("../../stores/shift-setup").ShiftID[]} _rhythm
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
     * @param {import("../../stores/shift-setup").ShiftID} id
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
        title={lang.get("dialog rhythm", "title")}
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
                        <th class="is-text-left">Name</th>
                        <th class="is-text-left">Short</th>
                        <th class="is-text-rigth" />
                    </tr>
                </thead>

                <tbody>
                    {#each rhythm as id, index}
                        {#await getShiftForID(id) then shift}
                            {#if !!shift}
                                <tr>
                                    <td class="is-text-left">{shift.name}</td>
                                    <td
                                        class="is-text-left"
                                        style={
                                            "width: 4em;" +
                                            `color: ${shift.color || "hsl(var(--fg))"};` +
                                            "text-shadow: .1em .1em .1em hsl(var(--border));"
                                        }
                                    >
                                        {shift.visible ? shift.shortName : ""}
                                    </td>
                                    <td class="is-text-right" style="width: 3em;">
                                        <Button.Icon
                                            color="destructive"
                                            ghost
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
            <figure class="no-scrollbar is-max-width">
                <FlexGrid.Row gap=".1em">
                    {#each shifts as shift}
                        <FlexGrid.Col class="no-user-select">
                            <Shift
                                style="height: 100%;"
                                {...shift}
                                on:click={() =>
                                    (rhythm = [...rhythm, shift.id])}
                            />
                        </FlexGrid.Col>
                    {/each}
                </FlexGrid.Row>
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
        scrollbar-width: none;
    }

    figure::-webkit-scrollbar {
        display: none;
    }
</style>
