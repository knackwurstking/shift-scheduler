<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";

    import { createEventDispatcher } from "svelte";
    import { UI } from "ui";

    import * as lang from "../../js/lang";

    import * as Store from "../../stores";

    import { Shift } from "../shift";

    const dispatch = createEventDispatcher();
    const shiftSetup = Store.shiftSetup.create();
    const view = Store.view.create();

    /** @type {UI.Dialog.Root} */
    let dialog;

    /** @type {HTMLElement} */
    let scrollContainer;

    /**
     * @type {import("../../stores/shift-setup").Shift[]}
     */
    let shifts = [];

    /**
     * @type {number[]}
     */
    let rhythm = [];

    $: rhythm && setTimeout(scrollToBottom, 150);

    /**
     * @param {import("../../stores/shift-setup").Shift[]} _shifts
     * @param {number[]} _rhythm
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

    /**
     * @param {number} id
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

<UI.Dialog.Root bind:this={dialog} fullscreen>
    <UI.Dialog.Header
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
                        <th class="is-text-right" />
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
                                        style={"width: 4em;" +
                                            `color: ${
                                                shift.color || "hsl(var(--fg))"
                                            };` +
                                            "text-shadow: .1em .1em .1em hsl(var(--border));"}
                                    >
                                        {shift.visible ? shift.shortName : ""}
                                    </td>
                                    <td
                                        class="is-text-right"
                                        style="width: 3em;"
                                    >
                                        <UI.Button.Icon
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
                                        </UI.Button.Icon>
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
                <UI.FlexGrid.Row gap=".1em">
                    {#each shifts as shift}
                        <UI.FlexGrid.Col class="no-user-select">
                            <Shift
                                style="height: 100%;"
                                {...shift}
                                on:click={() =>
                                    (rhythm = [...rhythm, shift.id])}
                            />
                        </UI.FlexGrid.Col>
                    {/each}
                </UI.FlexGrid.Row>
            </figure>
        </section>
    </section>

    <UI.Dialog.Footer>
        <UI.Button.Root
            color="primary"
            type="submit"
            on:click={() => dispatch("submit", rhythm)}
        >
            {lang.get("buttons", "submit")}
        </UI.Button.Root>
    </UI.Dialog.Footer>
</UI.Dialog.Root>

<style>
    figure {
        scrollbar-width: none;
    }

    figure::-webkit-scrollbar {
        display: none;
    }
</style>
