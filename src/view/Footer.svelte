<script>
    import { FlexGrid } from "svelte-css";

    import { Shift } from "../lib/components";
    import * as Store from "../lib/stores";

    /**************************************
     * Store: edit-mode && edit-mode-index
     **************************************/

    const editMode = Store.editMode.create();

    /*********************
     * Store: shift-setup
     *********************/

    const shiftSetup = Store.shiftSetup.create();
</script>

<footer
    class="ui-container is-max-width"
    class:visible={$editMode.open}
>
    {#if $editMode.open}
        <figure class="flex no-scrollbar is-max">
            <FlexGrid.Row gap=".1em">
                <FlexGrid.Col style="width: calc(7.5em + var(--spacing));" flex="0">
                    <Shift
                        class="is-max"
                        name="Reset"
                        visible={false}
                        active={$editMode.index === -2}
                        color="transparent"
                        id={-2}
                        on:click={() => {
                            if ($editMode.index === -2) {
                                editMode.indexUnselect();
                            } else {
                                editMode.indexReset();
                            }
                        }}
                    />
                </FlexGrid.Col>

                {#each $shiftSetup.shifts as shift, index}
                    <FlexGrid.Col style="width: calc(7.5em + var(--spacing));" flex="0">
                        <Shift
                            class="is-max"
                            {...shift}
                            active={$editMode.index === index}
                            on:click={() => {
                                if ($editMode.index === index) {
                                    editMode.indexUnselect();
                                } else {
                                    editMode.indexSelect(index);
                                }
                            }}
                        />
                    </FlexGrid.Col>
                {/each}
            </FlexGrid.Row>
        </figure>
    {/if}
</footer>

<style>
    footer {
        transform: none;
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 4em;
    }

    footer:not(.visible) {
        transform: translateY(100%);
    }
</style>
